from datetime import datetime

class Transaction:
    def __init__(self, accountno, value, category, year, month, day, hour, minute, ref):
        self.accountno = accountno
        self.value = value
        self.category = category
        self.time = datetime(year, month, day, hour, minute)
        self.ref = ref
        
class Account:
    def __init__(self, accountno, balance, account_type, interest_rate = 0, reference = ""):
        self.accountno = accountno
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
    
    