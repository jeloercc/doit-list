import { useState } from 'react';
import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {
// Initialize todoList state with an empty array for dynamic todos
 const [todoList, setTodoList] = useState([]);
 // Create a handler function to add a new todo
 function addTodo(todoTitle) {
 const newTodo = {
    id: Date.now(),
    title: todoTitle
  };
   // Update state functionally, spreading previous todos behind the new one
   setTodoList(previous => [newTodo, ...previous]);
}
 return (
    <div>
    <h1>Do It List</h1>
    {/* Pass the addTodo handler down to TodoForm via props */}
    <TodoForm onAddTodo={addTodo} />  
    {/* Pass the todoList state down to TodoList via props */}
    <TodoList todoList={todoList} />
  </div>
 );
}
export default App;
