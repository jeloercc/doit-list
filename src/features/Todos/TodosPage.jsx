import { useState, useEffect } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({ token }){
  // Initialize todoList state with an empty array for dynamic todos
  const [todoList, setTodoList] = useState([]);
  // Store API error messages
  const [error, setError] = useState('');
  // Track whether todos are being loaded from the API
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

// Fetch todos when the authentication token changes
useEffect(() => {
// Load todos from the API
async function fetchTodos() {
  // Start loading todos
  setIsTodoListLoading(true);

  try {
    // Request todos from the API
    const response = await fetch('/api/tasks?page=0&limit=99', {
      headers: {
        'X-CSRF-TOKEN': token
      },
      credentials: 'include'
    });

    // Handle unsuccessful responses
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      throw new Error('Failed to fetch todos');
    }

    // Read the tasks from the server response
    const data = await response.json();
    setTodoList(data.tasks);

  } catch (error) {
    // Store the error message
    setError(error.message);

  } finally {
    // Stop the loading state
    setIsTodoListLoading(false);
  }
}

  // Only fetch todos when a token exists
  if (token) {
    fetchTodos();
  }
}, [token]);

// Create a new todo and save it to the API
async function addTodo(todoTitle) {
  // Create a temporary todo for an immediate UI update
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false
  };

  // Add the temporary todo to the beginning of the list
  setTodoList(previous => [newTodo, ...previous]);

  try {
    // Send the new todo to the API
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify({
        title: todoTitle,
        isCompleted: false
      })
    });

    // Handle unsuccessful responses
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }

    // Read the saved todo from the API response
    const savedTodo = await response.json();

    // Replace the temporary todo with the server response
    setTodoList(previous =>
      previous.map(todo =>
        todo.id === newTodo.id ? savedTodo : todo
      )
    );

  } catch (error) {
    // Remove the temporary todo if the request fails
    setTodoList(previous =>
      previous.filter(todo => todo.id !== newTodo.id)
    );

    // Display the error message
    setError(error.message);
  }
}

// Mark a todo as completed and save the change to the API
async function completeTodo(id) {
  // Save the current list in case the request fails
  const previousTodoList = todoList;

  // Optimistically mark the todo as completed
  setTodoList(previous =>
    previous.map(todo =>
      todo.id === id
        ? { ...todo, isCompleted: true }
        : todo
    )
  );

  try {
    // Send the completed status to the API
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify({
        isCompleted: true
      })
    });

    // Handle unsuccessful responses
    if (!response.ok) {
      throw new Error('Failed to complete todo');
    }

  } catch (error) {
    // Restore the previous list if the request fails
    setTodoList(previousTodoList);

    // Display the error message
    setError(error.message);
  }
}
// Update a todo and save its changes to the API
async function updateTodo(editedTodo) {
  // Save the current list in case the request fails
  const previousTodoList = todoList;

  // Optimistically update the todo in the UI
  setTodoList(previous =>
    previous.map(todo =>
      todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
    )
  );

  try {
    // Send the updated title to the API
    const response = await fetch(`/api/tasks/${editedTodo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify({
        title: editedTodo.title,
        isCompleted: editedTodo.isCompleted
      })
    });

    // Handle unsuccessful responses
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

  } catch (error) {
    // Restore the previous list if the request fails
    setTodoList(previousTodoList);

    // Display the error message
    setError(error.message);
  }
}
   return (
  <div>
    {/* Display API errors with a button to clear them */}
    {error && (
      <div>
        <p>{error}</p>
        <button type="button" onClick={() => setError('')}>
          Clear Error
        </button>
      </div>
    )}

    {/* Display loading state while fetching todos */}
    {isTodoListLoading && <p>Loading todos...</p>}

    {/* Pass the addTodo handler to TodoForm */}
    <TodoForm onAddTodo={addTodo} />

    {/* Pass the todo list and handlers to TodoList */}
    <TodoList
      todoList={todoList}
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
    />
  </div>
 );
}

export default TodosPage;