// Add this at the beginning of your script.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            link.classList.add('active');
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).classList.add('active');
        });
    });

    // Calculator functionality
    // Calculator with History
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calculator-buttons button');
    const calcHistory = document.getElementById('calcHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');
    let history = [];

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (value === 'C') {
                display.value = '';
            } else if (value === '←') {
                display.value = display.value.slice(0, -1);
            } else if (value === '=') {
                try {
                    const result = eval(display.value);
                    const calculation = `${display.value} = ${result}`;
                    history.push(calculation);
                    updateHistory();
                    display.value = result;
                } catch {
                    display.value = 'Error';
                }
            } else {
                display.value += value;
            }
        });
    });

    function updateHistory() {
        calcHistory.innerHTML = history.map(calc => `<div>${calc}</div>`).join('');
    }

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        updateHistory();
    });

    // Business Tracker
    const addTransactionBtn = document.getElementById('addTransaction');
    const transactionHistory = document.getElementById('transactionHistory');
    let transactions = [];

    addTransactionBtn.addEventListener('click', () => {
        const type = document.getElementById('transactionType').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const desc = document.getElementById('transactionDesc').value;

        if (amount && desc) {
            transactions.push({ type, amount, desc });
            updateTransactions();
            updateBalance();
            // Clear inputs
            document.getElementById('transactionAmount').value = '';
            document.getElementById('transactionDesc').value = '';
        }
    });

    function updateTransactions() {
        transactionHistory.innerHTML = transactions.map(t => 
            `<div class="transaction ${t.type}">
                <span>${t.desc}</span>
                <span>$${t.amount.toFixed(2)}</span>
            </div>`
        ).join('');
    }

    function updateBalance() {
        const deposits = transactions.filter(t => t.type === 'deposit')
            .reduce((sum, t) => sum + t.amount, 0);
        const withdrawals = transactions.filter(t => t.type === 'withdraw')
            .reduce((sum, t) => sum + t.amount, 0);
        
        document.getElementById('totalDeposits').textContent = `$${deposits.toFixed(2)}`;
        document.getElementById('totalWithdraws').textContent = `$${withdrawals.toFixed(2)}`;
        document.getElementById('balance').textContent = `$${(deposits - withdrawals).toFixed(2)}`;
    }

    // Profit Calculator
    const calculateProfitBtn = document.getElementById('calculateProfit');
    let monthlyData = {};

    calculateProfitBtn.addEventListener('click', () => {
        const month = document.getElementById('monthSelect').value;
        const revenue = parseFloat(document.getElementById('revenue').value) || 0;
        const expenses = parseFloat(document.getElementById('expenses').value) || 0;
        const profit = revenue - expenses;

        monthlyData[month] = { revenue, expenses, profit };
        updateProfitSummary();
        updateYearlyTotals();

        // Clear inputs
        document.getElementById('revenue').value = '';
        document.getElementById('expenses').value = '';
    });

    function updateProfitSummary() {
        const monthlyProfits = document.getElementById('monthlyProfits');
        monthlyProfits.innerHTML = Object.entries(monthlyData).map(([month, data]) => 
            `<div class="profit-row">
                <div>${getMonthName(month)}</div>
                <div>$${data.revenue.toFixed(2)}</div>
                <div>$${data.expenses.toFixed(2)}</div>
                <div>$${data.profit.toFixed(2)}</div>
            </div>`
        ).join('');
    }

    function updateYearlyTotals() {
        const totalRev = Object.values(monthlyData).reduce((sum, data) => sum + data.revenue, 0);
        const totalExp = Object.values(monthlyData).reduce((sum, data) => sum + data.expenses, 0);
        const netProfit = totalRev - totalExp;

        document.getElementById('totalRevenue').textContent = `$${totalRev.toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `$${totalExp.toFixed(2)}`;
        document.getElementById('netProfit').textContent = `$${netProfit.toFixed(2)}`;
    }

    function getMonthName(monthNum) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[parseInt(monthNum) - 1];
    }
});
