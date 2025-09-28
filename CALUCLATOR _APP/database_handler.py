import sqlite3
import os
from datetime import datetime

class DatabaseHandler:
    def __init__(self):
        self.db_path = 'business_data.db'
        self.create_tables()
    
    def create_tables(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                amount REAL,
                description TEXT
            )
        ''')
        
        # Create monthly_profits table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS monthly_profits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT,
                revenue REAL,
                expenses REAL,
                profit REAL
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_transaction(self, date, amount, description):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO transactions (date, amount, description) VALUES (?, ?, ?)',
            (date, amount, description)
        )
        conn.commit()
        conn.close()
    
    def get_all_transactions(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM transactions ORDER BY date DESC')
        transactions = cursor.fetchall()
        conn.close()
        return transactions
    
    def save_monthly_profit(self, revenue, expenses, profit):
        month = datetime.now().strftime("%Y-%m")
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO monthly_profits (month, revenue, expenses, profit) VALUES (?, ?, ?, ?)',
            (month, revenue, expenses, profit)
        )
        conn.commit()
        conn.close()