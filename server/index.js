const express = require('express')
const app = express()
app.use(express.json()) //// Parses incoming JSON requests so you can access data via req.body
const cors = require('cors')
app.use(cors())

//temporary storage
let expenses = [
    {
        id: 1,
        amount: 1850,
        category: 'Electricity',
        date: '2026-10-05',
        note: 'Meralco bill'
    }
];

// READ: get all expense
app.get('/expenses', (req, res) => { // incoming request and outgoing response
    res.json(expenses);
})

// CREATE: add an expense
app.post('/expenses/', (req, res) => {
    const { amount, category, date, note } = req.body; // receives data. 

    if (!amount || Number(amount) <=0 || !category || !date) {
        return res.status(400).json({
            message: 'Please provide a valid amount, category, and date.'
        });
    }

    const newExpense = {
        id: Date.now(),
        amount: Number(amount),
        category,
        date,
        note: note || ''
    }

    expenses.push(newExpense)

    res.status(201).json({ // ({}) is the entire object, message is the prop, and the string is the value
    message: "Expense created successfully", 
    expense: newExpense
    });
})

//UPDATE: Modify an existing expense
app.put('/expenses/:id', (req, res) => {
    const id = Number(req.params.id);
    const { amount, category, date, note} = req.body; // data sent along with the request
    const expenseIndex = expenses.findIndex(
        expense => expense.id === id
    );

    if (expenseIndex === - 1) {
        return res.status(404).json({
            message: 'Expense not found'
        });
    }

    if (!amount || Number(amount) <=0 || !category || !date) {
    return res.status(400).json({
        message: 'Please provide a valid amount, category, and date.'
        });
    }
    const updatedExpense = {
        id,
        amount: Number(amount),
        category,
        date,
        note: note || '',
    }
    expenses[expenseIndex] = updatedExpense;
    res.json({
        message: 'Expense Updated Successfully',
        expense: updatedExpense
    });
})

app.delete('/expenses/:id', (req, res) => {
    const id = Number(req.params.id); // 

    const expenseExists = expenses.some(
        expense => expense.id === id
    );

    if (!expenseExists) {
        return res.status(404).json({
            message: 'Expenses id not found!'
        });
    }
    expenses = expenses.filter((expense) => expense.id !== id)
    res.status(204).send() // HTTP rules say that 204 must not have a body
})

app.listen(3000, () => console.log('Server running on port 3000'))

