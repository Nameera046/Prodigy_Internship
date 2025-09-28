import tkinter as tk
from tkinter import ttk
import datetime

class AdvancedCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Business Calculator")
        self.root.geometry("800x600")
        
        # Configure colors and styles
        self.root.configure(bg='white')  # White background
        self.style = ttk.Style()
        
        # Configure button styles
        self.style.configure('Regular.TButton', 
                           font=('Arial', 12),
                           padding=10)
        
        self.style.configure('Special.TButton',
                           font=('Arial', 12),
                           padding=10)
        
        self.style.configure('Trig.TButton',
                           font=('Arial', 12),
                           padding=10)
        
        # Create navigation frame
        self.create_navigation()
        
        # Initialize variables
        self.current_value = tk.StringVar()
        self.calculation_history = []
        
        self.create_calculator()

    def create_navigation(self):
        nav_frame = tk.Frame(self.root, bg='white')
        nav_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Label(nav_frame, 
                text="Business Calculator", 
                font=('Arial', 16, 'bold'),
                bg='white').pack(side='left')
        
        # Navigation buttons
        buttons = [("Calculator", self.show_calculator),
                  ("Business Tracker", self.show_business_tracker),
                  ("Profit Calculator", self.show_profit_calculator)]
        
        for text, command in buttons:
            tk.Button(nav_frame,
                     text=text,
                     command=command,
                     font=('Arial', 10),
                     relief='flat',
                     bg='white',
                     padx=10).pack(side='left', padx=5)

    def create_calculator(self):
        # Main calculator frame
        self.calc_frame = tk.Frame(self.root, bg='white')
        self.calc_frame.pack(expand=True, fill='both', padx=20, pady=10)
        
        # History section
        history_frame = tk.LabelFrame(self.calc_frame, text="Calculation History", bg='white')
        history_frame.pack(side='left', fill='y', padx=10)
        
        self.history_text = tk.Text(history_frame, width=30, height=15)
        self.history_text.pack(padx=5, pady=5)
        
        tk.Button(history_frame,
                 text="Clear History",
                 command=self.clear_history,
                 bg='#ff4444',
                 fg='white').pack(pady=5)
        
        # Calculator section
        calc_main = tk.Frame(self.calc_frame, bg='white')
        calc_main.pack(side='left', expand=True, fill='both', padx=10)
        
        # Display
        entry = tk.Entry(calc_main,
                        textvariable=self.current_value,
                        font=('Arial', 24),
                        justify='right',
                        bd=10,
                        relief='flat')
        entry.pack(fill='x', pady=20)
        
        # Buttons grid
        buttons_frame = tk.Frame(calc_main, bg='white')
        buttons_frame.pack(expand=True, fill='both')
        
        buttons = [
            ['C', '←', '%', '/'],
            ['sin', 'cos', 'tan', '^'],
            ['7', '8', '9', '*'],
            ['4', '5', '6', '-'],
            ['1', '2', '3', '+'],
            ['0', '.', '=', None]
        ]
        
        for i, row in enumerate(buttons):
            for j, text in enumerate(row):
                if text:
                    btn = tk.Button(buttons_frame,
                                  text=text,
                                  font=('Arial', 12),
                                  padx=15,
                                  pady=10,
                                  bg='#2196F3' if text.isdigit() or text in ['.', '='] else '#4CAF50',
                                  fg='white',
                                  relief='flat')
                    btn.grid(row=i, column=j, padx=2, pady=2, sticky='nsew')
                    btn.bind('<Button-1>', lambda e, text=text: self.click_button(text))
        
        # Configure grid weights
        for i in range(6):
            buttons_frame.grid_rowconfigure(i, weight=1)
        for i in range(4):
            buttons_frame.grid_columnconfigure(i, weight=1)

    def show_history(self):
        if self.history_window is None or not self.history_window.winfo_exists():
            self.history_window = tk.Toplevel(self.root)
            self.history_window.title("Calculation History")
            self.history_window.geometry("300x400")
            
            history_text = tk.Text(self.history_window, font=('Arial', 12))
            history_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
            
            clear_btn = ttk.Button(self.history_window, 
                                 text="Clear History",
                                 command=lambda: history_text.delete(1.0, tk.END))
            clear_btn.pack(pady=10)

    def show_business_tracker(self):
        # Create business tracker in a new window
        tracker_window = tk.Toplevel(self.root)
        tracker_window.title("Business Tracker")
        tracker_window.geometry("500x600")
        self.create_business_tracker(tracker_window)

    def show_profit_calculator(self):
        # Create profit calculator in a new window
        profit_window = tk.Toplevel(self.root)
        profit_window.title("Profit Calculator")
        profit_window.geometry("400x300")
        self.create_profit_calculator(profit_window)

    def create_business_tracker(self):
        # Business tracker with styled components
        ttk.Label(self.business_frame, 
                 text="Transaction Amount:",
                 style='TLabel').grid(row=0, column=0, pady=10, padx=10)
        self.transaction_amount = ttk.Entry(self.business_frame, 
                                          font=('Arial', 12))
        self.transaction_amount.grid(row=0, column=1, pady=10, padx=10)
        
        ttk.Label(self.business_frame, 
                 text="Description:",
                 style='TLabel').grid(row=1, column=0, pady=10, padx=10)
        self.transaction_desc = ttk.Entry(self.business_frame, 
                                        font=('Arial', 12))
        self.transaction_desc.grid(row=1, column=1, pady=10, padx=10)
        
        ttk.Button(self.business_frame, 
                  text="Add Transaction",
                  style='Action.TButton',
                  command=self.add_transaction).grid(row=2, column=0, columnspan=2, pady=20)
        
        # Transaction list with custom background
        self.transaction_list = tk.Text(self.business_frame, 
                                      height=15, 
                                      width=40,
                                      font=('Arial', 11),
                                      bg='#ecf0f1',  # Light gray
                                      fg='#2c3e50')  # Dark blue
        self.transaction_list.grid(row=3, column=0, columnspan=2, pady=10, padx=10)

    def create_profit_calculator(self):
        # Monthly profit calculation
        ttk.Label(self.profit_frame, text="Revenue:").grid(row=0, column=0, pady=5)
        self.revenue_entry = ttk.Entry(self.profit_frame)
        self.revenue_entry.grid(row=0, column=1, pady=5)
        
        ttk.Label(self.profit_frame, text="Expenses:").grid(row=1, column=0, pady=5)
        self.expenses_entry = ttk.Entry(self.profit_frame)
        self.expenses_entry.grid(row=1, column=1, pady=5)
        
        ttk.Button(self.profit_frame, text="Calculate Profit", 
                   command=self.calculate_profit).grid(row=2, column=0, columnspan=2, pady=10)
        
        self.profit_result = tk.Text(self.profit_frame, height=5, width=40)
        self.profit_result.grid(row=3, column=0, columnspan=2, pady=10)
    
    def click_button(self, value):
        current = self.current_value.get()
        
        if value == '=':
            try:
                result = eval(current)
                self.current_value.set(result)
            except:
                self.current_value.set("Error")
        else:
            self.current_value.set(current + value)
    
    def add_transaction(self):
        amount = self.transaction_amount.get()
        desc = self.transaction_desc.get()
        date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        
        if amount and desc:
            transaction = f"Date: {date}\nAmount: ${amount}\nDescription: {desc}\n{'-'*40}\n"
            self.transaction_list.insert(tk.END, transaction)
            self.business_transactions.append({
                'date': date,
                'amount': float(amount),
                'description': desc
            })
            
            # Clear entries
            self.transaction_amount.delete(0, tk.END)
            self.transaction_desc.delete(0, tk.END)
    
    def calculate_profit(self):
        try:
            revenue = float(self.revenue_entry.get())
            expenses = float(self.expenses_entry.get())
            profit = revenue - expenses
            
            result = f"Monthly Profit Summary:\n"
            result += f"Revenue: ${revenue:,.2f}\n"
            result += f"Expenses: ${expenses:,.2f}\n"
            result += f"Net Profit: ${profit:,.2f}"
            
            self.profit_result.delete(1.0, tk.END)
            self.profit_result.insert(tk.END, result)
        except:
            self.profit_result.delete(1.0, tk.END)
            self.profit_result.insert(tk.END, "Please enter valid numbers")

if __name__ == "__main__":
    root = tk.Tk()
    app = AdvancedCalculator(root)
    root.mainloop()
    