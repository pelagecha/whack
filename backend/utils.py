from datetime import datetime

class Transaction:
    def __init__(self, value, category, year, month, day, hour, minute, ref):
        self.value = value
        self.category = category
        self.time = datetime(year, month, day, hour, minute)
        self.ref = ref