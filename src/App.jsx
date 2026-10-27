import { useState, useEffect } from 'react'

const CATEGORIES = [
  'Electricity',
  'Water',
  'Housing',
  'Insurance',
  'Subscriptions',
  'Debt repayments',
  'Food and groceries',
  'Transportation',
  'Healthcare and medical',
  'Discretionary spending',
]

function App() {
  const [expenses, setExpenses] = useState(() => { // functions like getter and setter(but setter stores it and updates in react)
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : [
    { id: 1, amount: 1850, category: 'Electricity', date: '2026-10-05', note: 'Meralco bill' },
    { id: 2, amount: 500, category: 'Food and groceries', date: '2026-10-04', note: 'Weekly Groceries' },
  ]
  })
  const [amount, setAmount] = useState('') 
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [month, setMonth] = useState('')
  const [editingId, setEditingId] = useState(null)

//validation checker for fields
function handleAdd() {
  const missing = []
  if(!amount || Number(amount) <= 0) missing.push('a valid amount')
  if(!category) missing.push('a category')
  if(!date) missing.push('a date')

  if(missing.length > 0) {
    setError('Please add: ' + missing.join(', '))
    return;
  }

  if(editingId !== null) {
    const updatedExpense = {
      id: editingId,
      amount: Number(amount),
      category,
      date,
      note,
    }
    setExpenses(expenses.map((row) => (row.id == editingId ? updatedExpense : row)))
  } else {
    const newExpense = {
      id: Date.now(), // date.now is a quick id generation. 
      amount: Number(amount),
      category,
      date,
      note
    }
    setExpenses([...expenses, newExpense])
  }

  setEditingId(null)
  setAmount('')
  setCategory('')
  setDate('')
  setNote('')
  setError('')
}
  function handleEdit(id) {
    const currentObject = expenses.find((expense) => expense.id === id);
    if (currentObject) {
      setEditingId(id)
      setAmount(currentObject.amount);
      setCategory(currentObject.category);
      setDate(currentObject.date);
      setNote(currentObject.note);
    }
  }

  function handleDelete(id) {
    setExpenses(expenses.filter((expense) => expense.id !== id)) // expense.id, we do .<variable> to filter one field out of an object
  } // the .filter method selects a subset of items from an array based on a condition. 

  function handleClear() {
    setExpenses([]);
  }

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])
  const filteredExpenses = expenses.filter((expense) => expense.date.startsWith(month))
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) // calculates the total of the expenses
  const totalsByCategory = filteredExpenses.reduce((totals, expense) => {
    const {category, amount} = expense;
    totals[category] = (totals[category] || 0) + amount;
    return totals;
}, {});

  return (
    <div>s
      <h1>Expense Tracker</h1>

      <input type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Amount"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose a category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input 
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)} 
      />

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)} // on keystrokes, activate event and change the value of note
        placeholder="Note"
      />
      <button onClick={handleClear}>Clear all</button>

      <input
      type="month"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      />
      <p>Draft: {amount} | {category} | {date} | {note}</p>
      <h2>Total: ₱{total}</h2>
      <h2>Total by Category</h2>
      <ul>
        {Object.entries(totalsByCategory).map(([name, sum]) => (
          <li key={name}>{name}: ₱{sum}</li>
        ))}
      </ul>
      <ul>
        {filteredExpenses.map((expense) => ( // .map transforms every element of an array then makes a new array
          <li key={filteredExpenses.id}> {/* Key is only used for lists. we generate a key for each list. We make keys to react can tell the items apart */} 
            {expense.date} - {expense.category} - ₱{expense.amount}
            {expense.note && ` (${expense.note})`}
            <button onClick={() => handleEdit(expense.id)}>Edit</button>
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={handleAdd}>Add</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default App