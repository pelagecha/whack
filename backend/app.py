from flask import Flask, g, redirect, jsonify, request, flash #TODO add login
from flask_cors import CORS
from datetime import datetime
import os


from gpt import run_model
from database import create_connection, DATABASE_FILE, get_account_transactions, add_file_account_data, add_transaction, init_db, get_all_transaction_data

#Make the app and configure the secret key
app = Flask(__name__)
app.secret_key = "scrumptious"

CORS(app)

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

#TODO add login manager and configure

# Close database connection on shutdown
@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()
        
@app.route("/", methods=['GET'])
def index(): #TODO change to login
    return redirect("/home")
    
@app.route("/home", methods=['GET'])
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
        # Assuming run_model is a function that processes the chat input
        bot_response = run_model("chat", user_input)
        print(f"MY response is:{bot_response}")
        return jsonify({"response": bot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug = True)