from flask import Flask, g, redirect, jsonify, flash #TODO add login
from flask_cors import CORS
from datetime import datetime
import os

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

if __name__ == '__main__':
    app.run(debug = True)