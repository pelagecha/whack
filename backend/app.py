from flask import Flask, g, redirect, jsonify, flash #TODO add login
from datetime import datetime
import os

from database import create_connection, DATABASE_FILE, get_account_transactions, add_file_account_data, add_transaction, init_db, get_all_transaction_data

#Make the app and configure the secret key
app = Flask(__name__)
app.secret_key = "scrumptious"

#Initialise the database and create a connection to it on startup
db_connect = create_connection(f'database/{DATABASE_FILE}')
init_db(db_connect)

#TODO add login manager and configure

# Close database connection on shutdown
@app.teardown_appcontext
def close_db():
    if db_connect:
        db_connect.close
        
@app.route("/", methods=['GET'])
def index(): #TODO change to login
    return redirect("/home")
    
@app.route("/home", methods=['GET'])
def home():
    data = get_all_transaction_data(db_connect)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug = True)