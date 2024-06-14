document.addEventListener('DOMContentLoaded', loadExpenses);

document.getElementById('add-button').addEventListener('click', addExpense);
document.getElementById('update-button').addEventListener('click', updateExpense);

let editingExpenseId = null;

function addExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (name !== '' && !isNaN(amount) && amount > 0) {
        const expense = { id: Date.now(), name, amount };
        saveExpense(expense);
        appendExpense(expense);
        updateTotal();
        nameInput.value = '';
        amountInput.value = '';
    } else {
        alert('Please enter valid expense name and amount.');
    }
}

function appendExpense(expense) {
    const expenseList = document.getElementById('expense-list');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', expense.id);
    listItem.innerHTML = `
        ${expense.name} - $${expense.amount.toFixed(2)}
        <div>
            <button class="edit" onclick="editExpense(${expense.id})">Edit</button>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `;
    expenseList.appendChild(listItem);
}

function saveExpense(expense) {
    const expenses = getExpenses();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

function loadExpenses() {
    const expenses = getExpenses();
    expenses.forEach(expense => appendExpense(expense));
    updateTotal();
}

function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.querySelector(`[data-id="${id}"]`).remove();
    updateTotal();
}

function editExpense(id) {
    const expense = getExpenses().find(expense => expense.id === id);
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');

    nameInput.value = expense.name;
    amountInput.value = expense.amount;

    document.getElementById('add-button').style.display = 'none';
    document.getElementById('update-button').style.display = 'block';

    editingExpenseId = id;
}

function updateExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (name !== '' && !isNaN(amount) && amount > 0) {
        let expenses = getExpenses();
        expenses = expenses.map(expense => {
            if (expense.id === editingExpenseId) {
                return { id: expense.id, name, amount };
            }
            return expense;
        });

        localStorage.setItem('expenses', JSON.stringify(expenses));

        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = '';
        expenses.forEach(expense => appendExpense(expense));

        document.getElementById('add-button').style.display = 'block';
        document.getElementById('update-button').style.display = 'none';

        nameInput.value = '';
        amountInput.value = '';

        editingExpenseId = null;
        updateTotal();
    } else {
        alert('Please enter valid expense name and amount.');
    }
}

function updateTotal() {
    const expenses = getExpenses();
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    document.getElementById('total-amount').innerText = total.toFixed(2);
}