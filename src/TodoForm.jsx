import { useState, useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();

  // Create state variable workingTodoTitle initialized to empty string
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    
    if (workingTodoTitle.trim()) {
      // Pass workingTodoTitle to onAddTodo instead of event.target value
      onAddTodo(workingTodoTitle);
      
      // Reset the input by calling the state setter with an empty string
      setWorkingTodoTitle('');
      
      // Keep focus on input after submit
      inputRef.current.focus();
    }
  };

  return (
      <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder={'Todo text'}
        required
        // Connect input to state 
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        />
      <button type="submit" disabled={!workingTodoTitle.trim()}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;