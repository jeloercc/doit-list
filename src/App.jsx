import { useState } from 'react';
import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
// Moved const todoList out of the App component,Rename todoList to todos
  const todos = [
    { id: 1, title: "review resources" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
  ];

function App() {
// Implement useState inside the top of the App component
 const [todoList, setTodoList] = useState(todos);
 return (
    <div>
      <h1>Do It List</h1>
      <TodoForm />
      {/* 3. Add a todoList prop to the TodoList instance */}
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App;
