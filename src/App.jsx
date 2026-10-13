import './App.css'

function App() {
const todoList = [
    { id: 1, title: "Repasar la lección de React" },
    { id: 2, title: "Tomar notas" },
    { id: 3, title: "Programar la app" },
  ]

  return (
    <div>
      <h1>Do It List</h1>
      <ul>
            {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  )
}

export default App
