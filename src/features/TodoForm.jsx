import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../utils/todoValidation';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  // Create state variable workingTodoTitle initialized to empty string
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();
    
    // Check if the title is not empty
    if (workingTodoTitle.trim()) {
      // Send the todo title to the parent component
      onAddTodo(workingTodoTitle);
      
      // Reset the input by calling the state setter with an empty string
      setWorkingTodoTitle('');
      
      // Keep focus on input after submit
      inputRef.current.focus();
    }
  };

 return (
    <form onSubmit={handleAddTodo}>
      {/* Reusable input component with label */}
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      
      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
      Add Todo
      </button>
    </form>
  );
}
export default TodoForm;