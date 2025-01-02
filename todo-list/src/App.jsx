import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = () => {
    fetch('http://localhost:5000/todo-lists')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        setTodos(data)
      })
      .catch(error => {
        console.error('Error fetching todo-lists:', error)
      })
  }

  const addTodo = () => {
    if (newTodo.trim() === '') return

    fetch('http://localhost:5000/todo-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ work: newTodo })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log('Add response:', data) 
        fetchTodos()
      })
      .catch(error => {
        console.error('Error adding todo:', error)
      })

    setNewTodo('')
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/todo-lists/${id}`, {
      method: 'POST' 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log('Delete response:', data)
        fetchTodos()
      })
      .catch(error => {
        console.error('Error deleting todo:', error)
      })
  }

  return (
    <div>
      <h1>TODO LIST</h1>

      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.work}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
