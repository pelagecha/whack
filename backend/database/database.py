import sqlite3
from utils import User
from datetime import datetime

'''Creates a connection to the database specified by file and returns it'''
def create_connection(file):
    connection = sqlite3.connect(file)
    return connection

'''Creates the tables in the database on the connection'''
def create_tables(connection):
    cursor = connection.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        );
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS accounts (
            accountno TEXT PRIMARY KEY,
            userid INTEGER NOT NULL,
            balance REAL NOT NULL,
            type TEXT NOT NULL,
            interest_rate REAL DEFAULT 0,
            reference TEXT,
            FOREIGN KEY(userid) REFERENCES users(id)
        );            
    ''')
    
    cursor.execute('''
       CREATE TABLE IF NOT EXISTS transactions (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           accountno TEXT NOT NULL,
           ref TEXT NOT NULL,
           val REAL NOT NULL,
           time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           category TEXT,
           FOREIGN KEY(accountno) REFERENCES accounts(accountno)
       );    
    ''')
    
    connection.commit()
    cursor.close()

'''Initialises the database'''
def init_db(connection):
    reset_db(connection)
    create_tables(connection)
    add_file_account_data(connection, "./sample/sample_account_data.csv")
    add_file_transaction_data(connection, "./sample/sample_transaction_data.csv")
    add_file_user_data(connection, "./sample/sample_user_data.csv")
    

'''Adds transaction data from a csv file specified by filepath'''
def add_file_transaction_data(connection, filepath):
    transactions = []
    with open(filepath, "r") as file1:
        for line in file1:
            data = line.strip().split(",")
            date = data[1].strip().split("-")
            time = data[2].strip().split(":")
            transactions.append((data[0], data[5], float(data[4]), datetime(int(date[0]), int(date[1]), int(date[2]), int(time[0]), int(time[1])), data[3]))
    cursor = connection.cursor()
    cursor.executemany('''
        INSERT INTO transactions (accountno, ref, val, time, category)
        VALUES (?, ?, ?, ?, ?);
    ''', transactions)
    connection.commit()
    cursor.close()

'''Adds account data from a csv file specified by filepath'''
def add_file_account_data(connection, filepath):
    accounts = []
    with open(filepath, "r") as file1:
        for line in file1:
            data = line.strip().split(",")
            accounts.append((data[0], int(data[1]), float(data[2]), data[3], float(data[4]), data[5]))
    cursor = connection.cursor()
    cursor.executemany('''
        INSERT INTO accounts (accountno, userid, balance, type, interest_rate, reference)
        VALUES (?, ?, ?, ?, ?, ?);
    ''', accounts)
    connection.commit()
    cursor.close()

'''Adds user data from a csv file specified by filepath'''
def add_file_user_data(connection, filepath):
    users = []
    with open(filepath, "r") as file1:
        for line in file1:
            data = line.strip().split(",")
            users.append((data[0], data[1], data[2]))
    cursor = connection.cursor()
    cursor.executemany('''
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?);                   
    ''', users)
    connection.commit()
    cursor.close()
    
'''Adds the data from a transaction object to the database'''
def add_transaction(connection, transaction):
    cursor = connection.cursor()
    cursor.execute('''
       INSERT INTO transactions (accountno, ref, val, time, category)
       VALUES (?, ?, ?, ?, ?);
    ''', (transaction.accountno, transaction.ref, transaction.value, transaction.time, transaction.category))
    connection.commit()
    cursor.close()

'''Adds the data from an account object to the database'''
def add_account(connection, account):
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO accounts (accountno, userid, balance, type, interest_rate, reference)
        VALUES (?, ?, ?, ?, ?, ?);
    ''', (account.accountno, account.userid, account.balance, account.type, account.interest_rate, account.reference))
    connection.commit()
    cursor.close()

'''Adds the data from an account object to the database'''
def add_user(connection, username, email, password):
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?);               
    ''', (username, email, password))
    connection.commit()
    cursor.close()

'''Changes the balance of an account by <change> amount.'''
def alter_account_balance(connection, change, accountno):
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE accounts
        SET balance = balance + ?
        WHERE accountno = ?;
    ''', change, accountno)
    connection.commit()
    cursor.close()

'''Changes the interest rate on an account'''
def change_interest_rate(connection, new_rate, accountno):
    cursor = connection.cursor()
    cursor.execute('''
        UPDATE accounts
        SET interest_rate = ?
        WHERE accountno = ?;
    ''', new_rate, accountno)
    connection.commit()
    cursor.close()

'''Removes all tables and recreates them'''
def reset_db(connection):
    cursor = connection.cursor()
    cursor.execute('''
        DROP TABLE IF EXISTS transactions;
    ''')
    cursor.execute('''
        DROP TABLE IF EXISTS accounts;               
    ''')
    cursor.execute('''
        DROP TABLE IF EXISTS users;               
    ''')
    connection.commit()
    cursor.close()
    
'''Takes a database connection and account number and returns all transactions associates with that account'''
def get_account_transactions(connection, accountno):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT * 
        FROM transactions
        WHERE accountno = ?;
    ''', accountno)
    records = cursor.fetchall()
    cursor.close()
    return records

'''Testing method that gets all transaction data''' #TODO remove
def get_all_transaction_data(connection):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT *
        FROM transactions;
    ''')
    records = cursor.fetchall()
    cursor.close()
    
    column_names = [description[0] for description in cursor.description]
    return [dict(zip(column_names, record)) for record in records]

'''Fetches a user record from the database and returns a User object'''
def get_user(connection, username):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT username, email, password
        FROM users
        WHERE username = ?               
    ''', (username,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        user_obj = User()
        user_obj.username, user_obj.email, user_obj.password = user
        return user_obj
    return None

def get_balance(connection, accountno):
    records = get_account_transactions(connection, accountno)
    bal = 0
    for record in records:
        bal += record[-2]
    return bal


if __name__ == "__main__":
    connection = create_connection("finance.db")
    reset_db(connection)
    create_tables(connection)
    add_file_account_data(connection, "../sample/sample_account_data.csv")
    add_file_transaction_data(connection, "../sample/sample_transaction_data.csv")
    add_file_user_data(connection, "../sample/sample_user_data.csv")
    connection.close()
    
    