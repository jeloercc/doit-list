import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
// Import validation helper to reuse it for the Update button
import { isValidTodoTitle } from '../../utils/todoValidation';

// Add onCompleteTodo to the props using destructuring
function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  // Add a state variable isEditing and its associated state update function
  const [isEditing, setIsEditing] = useState(false);
  // Create a new state variable, workingTitle and its associated state update function
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  // Create a handleCancel event helper
  const handleCancel = () => {
    // resets the workingTitle to todo.title
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  // Create a handleEdit event helper
  const handleEdit = (event) => {
    // uses the event.target.value to update the workingTitle state value
    setWorkingTitle(event.target.value);
  };
  // Create a helper function, handleUpdate
  const handleUpdate = (event) => {
    // if isEditing is false, return immediately to exit the function
    if (!isEditing) return;
    // prevent the default form submission behavior 
    event.preventDefault();
    // calls onUpdateTodo and pass in an object that destructures todo and sets the title equal to workingTitle
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  };

  return (
    <li>
      {/* Add an onSubmit handler to the form element and pass it handleUpdate */}
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel 
              value={workingTitle} 
              onChange={handleEdit}
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            {/* Add another button below the "Cancel" button */}
            <button 
              type="button" 
              onClick={handleUpdate} 
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;