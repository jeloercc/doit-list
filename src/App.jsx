import { useState } from 'react';
import './App.css'
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';

function App() {
 // Initialize todoList state with an empty array for dynamic todos
 const [todoList, setTodoList] = useState([]);
 
 // Create a handler function to add a new todo
 function addTodo(todoTitle) {
 const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false // Added: Set initial completed status to false
  };
   // Update state functionally, spreading previous todos behind the new one
   setTodoList(previous => [newTodo, ...previous]);
 }
  // Added: Handler to mark a specific todo as completed
  function completeTodo(id) {
    const updatedList = todoList.map(todo => {
      // Check if the current todo matches the provided id
      if (todo.id === id) {
        // Return a new object spreading the todo and updating isCompleted
        return { ...todo, isCompleted: true };
      }
      // If it doesn't match, return the todo unchanged
      return todo;
    });
    // Update the state with the resulting array
    setTodoList(updatedList);
 }
  // Create an updateTodo function that takes an editedTodo argument
  function updateTodo(editedTodo) {
    // Map through the todos, comparing each todo.id with the updated todo's id
    const updatedTodos = todoList.map(todo => {
      if (todo.id === editedTodo.id) {
        // If it matches - return a new object that destructures the editedTodo
        return { ...editedTodo };
      }
      // If not a match - return the current todo
      return todo;
    });
    
    // Update the todoList state value with updatedTodos
    setTodoList(updatedTodos);
  }

 return (
    <div>
    <h1>Do It List</h1>
    {/* Pass the addTodo handler down to TodoForm via props */}
    <TodoForm onAddTodo={addTodo} />  
    {/* Pass the todoList state down to TodoList via props */}
    <TodoList 
     todoList={todoList}
     onCompleteTodo={completeTodo}
     onUpdateTodo={updateTodo}
     />
  </div>
 );
}
export default App;
