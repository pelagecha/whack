from datetime import datetime
from flask_login import UserMixin
from classifier import classify_item
from backend.read_receipt import read_receipt

class Transaction:
    def __init__(self, accountno, value, category, year, month, day, hour, minute, ref):
        self.accountno = accountno
        self.value = value
        self.category = category
        self.time = datetime(year, month, day, hour, minute)
        self.ref = ref
        
class Account:
    def __init__(self, accountno, userid, balance, account_type, interest_rate = 0, reference = ""):
        self.accountno = accountno
        self.userid = userid
        self.balance = balance
        self.account_type = account_type
        self.interest_rate = interest_rate
        self.reference = reference
    
    '''Takes a future date and returns the balance at that date using the interest rate and current balance'''
    def calculate_future_balance(self, future_date):
        if self.balance == 0 or self.interest_rate == 0:
            return self.balance
        
        if future_date < datetime.now():
            raise Exception("Error: Date given is before current date.")
        
        months = (future_date - datetime.now()).month
        return self.balance * ((1 + self.interest_rate)**months)
    
class User(UserMixin):
    def __self__(self, username, email, password):
        self.username = username
        self.email = email 
        self.password = password
        
    def get_id(self):
        return self.username
    

def image_to_db_entry(file_path, account_no):
    named_prices = read_receipt(file_path, file_path)

    cum_price = 0
    cum_names = ""

    for (name, price) in named_prices:
        cum_price += price
        cum_names += " " + name

    return (classify_item(cum_names), price) 