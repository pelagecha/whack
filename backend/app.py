from flask import Flask, g, redirect, jsonify, flash, request
from flask_cors import CORS
from flask_login import login_user, LoginManager, current_user, logout_user, login_required
from flask_mail import Mail, Message
from werkzeug import security
from datetime import datetime
import os


from gpt import run_model
from database import create_connection, DATABASE_FILE, get_account_transactions, add_file_account_data, add_transaction, init_db, get_all_transaction_data, get_user, add_user

#Make the app and configure the secret key
app = Flask(__name__)
app.secret_key = "scrumptious"

#Suppress emails during development. Change to true for production
app.config['MAIL_SUPPRESS_SEND'] = True

#Configure CORS for the app
CORS(app)

#Create mail handler
mail = Mail(app)

#Initialise the database
def initialise_db():
    db = create_connection(f'database/{DATABASE_FILE}')
    init_db(db)
    
initialise_db()

#Give a database connection
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

#Initialise login manager
login_manager = LoginManager()
login_manager.init_app(app)

#Defines how the login manager gets the current user
@login_manager.user_loader
def load_user(username):
    db = get_db()
    return get_user(db, username)

#Defines what happens when an unauthorised user attempts to access a page that requires login
@login_manager.unauthorized_handler
def unauthorised_callback():
    flash("You need to be logged in to access this page")

#Send a post request with login details to login a user
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("username")
        password = request.form.get("password")
        user = get_user(username)
        if user == None:
            flash("Incorrect Username or Password!")
            return jsonify(successful=False)
        elif not security.check_password_hash(user.password, password):
            flash("Incorrect username or password")
            return jsonify(successful=False) 
        else:
            login_user(user.username)
            return jsonify(successful=True)

#Send a post request with new user details to add them to the database
@app.route("/register", methods = ['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        db = get_db()
        add_user(db, username, email, security.generate_password_hash(password))
        login_user(username)
        return jsonify(success=True)
        
#Send a get request with a username to check if it is taken
@app.route("/check_username", methods=['GET'])
def check_username():
    username = request.args.get("username")
    db = get_db()
    user = get_user(db, username)
    if user == None:
        return jsonify(taken=False)
    return jsonify(taken=True)

#Send a get request to logout the current user
@app.route("/logout", methods = ['GET'])
@login_required
def logout():
    logout_user()

@app.route("/home", methods=['GET'])
@login_required
def home():
    db = get_db()
    data = get_all_transaction_data(db)
    return jsonify(data)


@app.route("/chat", methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message", "")
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        db = get_db()
        # Replace 0 with the actual account number
        data = str(get_account_transactions(db, 0))
        # Assuming run_model is a function that processes the chat input
        bot_response = run_model("chat", user_input + data)
        print(f"MY response is:{bot_response}")
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

'''Sends an email. Requires: 
username - username of the user to send the email to
subject - subject line of the email
template - html of the message'''
def send_email(username, subject, template):
    db = get_db()
    user = get_user(db, username)
    
    if user != None:
        email = user.email
        
        sender = "Nikita.Pelagecha@warwick.ac.uk"
        message = Message(subject = subject, sender = ("NOREPLY", sender), recipients = email)
        
        message.html = template
        
        mail.send(message)

if __name__ == '__main__':
    app.run(debug = True)
    