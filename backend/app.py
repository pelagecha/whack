from flask import Flask, flash, g, jsonify, request
from flask_cors import CORS
from flask_login import login_user, LoginManager, current_user, logout_user, login_required
from flask_mail import Mail, Message
from werkzeug import security
from datetime import datetime
from utils import User

# Import your database functions and other dependencies
from gpt import run_model
from database import create_connection, DATABASE_FILE, get_account_transactions, add_file_account_data, add_transaction, init_db, get_all_transaction_data, get_user, add_user, get_user_accounts, get_user_transactions, update_conversation, get_dialogue

# Initialize the app and configure the secret key
app = Flask(__name__)
app.secret_key = "scrumptious"

# Suppress emails during development. Change to False for production
app.config['MAIL_SUPPRESS_SEND'] = True

# Configure CORS for the app and allow credentials
CORS(app, supports_credentials=True)

# Create mail handler
mail = Mail(app)

# Initialize the database
def initialise_db():
    db = create_connection(f'database/{DATABASE_FILE}')
    init_db(db)

initialise_db()

# Provide a database connection
def get_db():
    if 'db' not in g:
        g.db = create_connection(f'database/{DATABASE_FILE}')
    return g.db

# Close database connection on shutdown
@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)

<<<<<<< HEAD
# User class for Flask-Login
class User(UserMixin):
    def __init__(self, username, password, email):
        self.id = username  # Flask-Login uses 'id' as the unique identifier
        self.username = username  # Add this line to explicitly define 'username'
        self.password = password
        self.email = email

=======
>>>>>>> a9e514c2577e46a2e58caac74e3f85c262417d0c
# Defines how the login manager gets the current user
@login_manager.user_loader
def load_user(username):
    db = get_db()
    return get_user(db, username)

# Defines what happens when an unauthorized user attempts to access a page that requires login
@login_manager.unauthorized_handler
def unauthorized_callback():
    return jsonify({"error": "Unauthorized"}), 401

# Send a POST request with login details to log in a user
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        db = get_db()
        user = get_user(db, username)
        if user == None:
            flash("Incorrect Username or Password!")
            return jsonify(successful=False)
        elif not security.check_password_hash(user.password, password):
            flash("Incorrect username or password")
            return jsonify(successful=False) 
        else:
            login_user(user)
            return jsonify(successful=True)
    elif request.method == 'GET':
        if current_user.is_authenticated:
            return jsonify(successful=True)
        else:
            return jsonify(successful=False)

# Send a POST request with new user details to add them to the database
@app.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    user = User(username, email, security.generate_password_hash(password))
    db = get_db()
    add_user(db, user)
    login_user(user)
    return jsonify(success=True)

# Send a GET request with a username to check if it is taken
@app.route("/check_username", methods=['GET'])
def check_username():
    username = request.get_json().get("username")
    db = get_db()
    user = get_user(db, username)
    if user is None:
        return jsonify(taken=False)
    return jsonify(taken=True)

# Send a GET request to log out the current user
@app.route("/logout", methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify(success=True)

#Send user data to the home
@app.route("/home", methods=['GET']) #TODO remove
@login_required
def home():
    db = get_db()
    data = get_all_transaction_data(db)
    return jsonify(data)

#Send information on all the accounts owned by the current user
@app.route("/user_accounts", methods = ['GET'])
@login_required
def user_accounts():
    db = get_db()
    account_info = get_user_accounts(db, current_user.username)
    return jsonify(account_info)

#Send information on all the transaction of the current user
@app.route("/user_transactions", methods = ['GET'])
@login_required
def user_transactions():
    db = get_db()
    data = get_user_transactions(db, current_user.username)

# Take in input and provide it as a prompt to chat model
@app.route("/chat", methods=['POST'])
def chat():
    db = get_db()
    data = request.json
    user_input = data.get("message", "")
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # Assuming run_model is a function that processes the chat input
        history = get_dialogue(db)
        bot_response = run_model("chat", history + user_input + data)
        update_conversation(db, bot_response)
        print(f"MY response is:{bot_response}")
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)