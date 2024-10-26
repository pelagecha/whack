'''Takes a database connection and account number and range of dates and returns all the transactions during those times'''
def get_transactions_in_time(connection, accountno, starttime, endtime):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT SUM(val) as Expense
        FROM transactions
        WHERE accountno = ? and time > ? and time < ?;
    ''', accountno, starttime, endtime)
    records = cursor.fetchall()
    cursor.close()
    return records

'''Takes a database connection and account number and a category and returns all the transactions in that category'''
def get_category_transactions(connection, accountno, category):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT ref as Item, val as Expense, time as Time
        FROM transactions
        WHERE accountno = ? and category = ?;
    ''', accountno, category)
    records = cursor.fetchall()
    cursor.close()
    return records

'''Takes a database connection and account number and returns an ordered list of the categories in terms of expense and the expense'''
def get_expenses_per_category(connection, accountno):
    cursor = connection.cursor()
    cursor.execute('''
        SELECT category, SUM(val) as Expense
        ORDER BY expense DES
        FROM transactions
        WHERE accountno = ?;
    ''', accountno)
    records = cursor.fetchall()
    cursor.close()
    return records
