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
       CREATE TABLE IF NOT EXISTS transactions (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           ref TEXT NOT NULL,
           val REAL NOT NULL,
           time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           category TEXT
       );    
    ''')
    
    connection.commit()
    cursor.close()

'''Initialised the database'''
def init_db(connection):
    create_tables(connection)

'''Adds data from a csv file specified by filename from the sample folder'''
def add_file_data(connection, filename):
    transactions = []
    with open(f"/backend/sample/{filename}", "r") as file1:
        for line in file1:
            data = line.split(",").strip()
            date = data[0].split("-").strip()
            time = data[1].split(":").strip()
            transactions.append((data[4], float(data[3]), datetime(int(date[0]), int(date[1]), int(date[2]), int(time[0]), int(time[1])), data[3]))
    cursor = connection.cursor()
    cursor.executemany('''
        INSERT INTO transactions (ref, val, time, category)
        VALUES (?, ?, ?, ?)
    ''', transactions)

'''Adds the data from a transaction object to the database'''
def add_transaction(connection, transaction):
    cursor = connection.cursor()
    cursor.execute('''
       INSERT INTO transactions (ref, val, time, category)
       VALUES (?, ?, ?, ?)
    ''', (transaction.ref, transaction.value, transaction.time, transaction.category))
    cursor.commit()
    cursor.close()

'''Removes all tables and recreates them'''
def reset_db(connection):
    cursor = connection.cursor()
    cursor.execute('''
        DROP TABLE IF EXISTS transactions CASCADE;
    ''')
    connection.commit()
    cursor.close()
    create_tables(connection)
    
    
    