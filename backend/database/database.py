import sqlite3
from datetime import datetime

'''Creates a connection to the database specified by file and returns it'''
def create_connection(file):
    connection = sqlite3.connect(file)
    return connection

'''Creates the tables in the database on the connection'''
def create_tables(connection):
    cursor = connection.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS accounts (
            accountno TEXT PRIMARY KEY,
            balance REAL NOT NULL,
            type TEXT NOT NULL,
            interest_rate REAL DEFAULT 0,
            reference TEXT
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
    add_file_account_data(connection, "../sample/sample_account_data.csv")
    add_file_transaction_data(connection, "../sample/sample_transaction_data.csv") #TODO uncomment
    

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
            accounts.append((data[0], float(data[1]), data[2], float(data[3]), data[4]))
        cursor = connection.cursor()
    cursor.executemany('''
        INSERT INTO accounts (accountno, balance, type, interest_rate, reference)
        VALUES (?, ?, ?, ?, ?);
    ''', accounts)
    connection.commit()
    cursor.close()
    

'''Adds the data from a transaction object to the database'''
def add_transaction(connection, transaction):
    cursor = connection.cursor()
    cursor.execute('''
       INSERT INTO transactions (accountno, ref, val, time, category)
       VALUES (?, ?, ?, ?, ?)
    ''', (transaction.accountno, transaction.ref, transaction.value, transaction.time, transaction.category))
    connection.commit()
    cursor.close()

'''Adds the data from an account object to the database'''
def add_account(connection, account):
    cursor = connection.cursor()
    cursor('''
        INSERT INTO accounts (accountno, balance, type, interest_rate, reference)
        VALUES (?, ?, ?, ?, ?);
    ''', account.accountno, account.balance, account.type, account.interest_rate, account.reference)
    connection.commit()
    cursor.close()

'''Removes all tables and recreates them'''
def reset_db(connection):
    cursor = connection.cursor()
    cursor.execute('''
        DROP TABLE IF EXISTS transactions;
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

if __name__ == "__main__":
    connection = create_connection("finance.db")
    init_db(connection)
    connection.close()
    
    