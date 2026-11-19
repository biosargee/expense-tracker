
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts'


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

const API_URL = 'http://localhost:3000/expenses'

function App() {
  useEffect(() => {
    async function loadExpenses() { // async keyword placed before a function to allow await, forcing the function to always return a promise
      const res = await fetch(API_URL) // sends a GET request to the server, returns a Promise (an object that represents eventual result of an async operation)
      const data = await res.json() // await pauses the execution of an async function until a promise settles.
      setExpenses(data)
    }
    loadExpenses()
  }, [])
  const [expenses, setExpenses] = useState(() => { 
  
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
    setExpenses(expenses.map((row) => (row.id === editingId ? updatedExpense : row)))
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

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE'})
      if (res.ok) throw new Error('Delete Failed') 
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (err) {
      setError('Could not delete. Is the server running?')
    }
  }
    
  function handleClear() {
    setExpenses([]);
  }

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])
  const filteredExpenses = expenses.filter((expense) => expense.date.startsWith(month))
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) // calculates the total of the expenses
  const totalsByCategory = filteredExpenses.reduce((totals, expense) => { // .reduce takes an array and combines its items into one final result.
    const {category, amount} = expense;
    totals[category] = (totals[category] || 0) + amount; // || 0 is added because category might not have a total yet
    return totals;
}, {});

  const chartData = Object.entries(totalsByCategory).map(([paramsCategory, paramsTotal]) => ({
    category: paramsCategory,
    total: paramsTotal
  }));

  return (
    <div>
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
      <BarChart
      width={600}
      height={300}
      data={chartData}
      >
        <XAxis dataKey="category"></XAxis>
        <YAxis></YAxis>
        <Tooltip></Tooltip>
        <Bar dataKey="total" fill="#8884d8"/>
      </BarChart>
      <ul>
        {Object.entries(totalsByCategory).map(([name, sum]) => (
          <li key={name}>{name}: ₱{sum}</li>
        ))}
      </ul>
      <ul>
        {filteredExpenses.map((expense) => ( // .map transforms every element of an array then makes a new array
          <li key={expense.id}> {/* Key is only used for lists. we generate a key for each list. We make keys to react can tell the items apart */} 
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