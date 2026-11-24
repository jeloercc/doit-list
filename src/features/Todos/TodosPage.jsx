import { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';

function TodosPage({ token }) {
  // Initialize todoList state with an empty array for dynamic todos
  const [todoList, setTodoList] = useState([]);
  // Store API error messages
  const [error, setError] = useState('');
  // Store errors related to filtering and sorting
  const [filterError, setFilterError] = useState('');
  // Track whether todos are being loaded from the API
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  // Store the selected sorting field
  const [sortBy, setSortBy] = useState('createdAt');
  // Store the selected sorting direction
  const [sortDirection, setSortDirection] = useState('desc');
  // Store the current search input
  const [filterTerm, setFilterTerm] = useState('');
  // Delay search updates by 300 milliseconds
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  // Track changes to the todo data for cache invalidation
  const [dataVersion, setDataVersion] = useState(0);

  // Invalidate memoized data after a successful todo mutation
  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

  // Fetch todos when the token, sorting options, or search term change
  useEffect(() => {
    // Load todos from the API
    async function fetchTodos() {
      // Start loading todos
      setIsTodoListLoading(true);

      try {
        // Build query parameters for sorting, searching, and pagination
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };

        // Include the search term only when it has a value
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        // Request todos from the API
        const response = await fetch(`/api/tasks?${params}`, {
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

        // Clear previous API errors after a successful fetch
        setError('');

        // Clear previous filtering and sorting errors
        setFilterError('');
      } catch (error) {
        // Handle filtering and sorting errors separately
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
        // Handle general API fetching errors
        setError(`Error fetching todos: ${error.message}`);
        }

     } finally {
        // Stop the loading state
        setIsTodoListLoading(false);
      }
    }

    // Only fetch todos when a token exists
    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  // Update the search term when the user types
  function handleFilterChange(newTerm) {
    setFilterTerm(newTerm);
  }

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

      // Invalidate cache after successfully creating a todo
      invalidateCache();

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

      // Invalidate cache after successfully completing a todo
      invalidateCache();

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
        todo.id === editedTodo.id
          ? { ...todo, ...editedTodo }
          : todo
      )
    );

    try {
      // Send the updated todo to the API
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

      // Invalidate cache after successfully updating a todo
      invalidateCache();

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
          <button
            type="button"
            onClick={() => setError('')}
          >
            Clear Error
          </button>
        </div>
      )}

{/* Display filtering and sorting errors with recovery options */}
{filterError && (
  <div>
    <p>{filterError}</p>

    {/* Clear the filter error message */}
    <button
      type="button"
      onClick={() => setFilterError('')}
    >
      Clear Filter Error
    </button>

    {/* Reset search and sorting options to their defaults */}
    <button
      type="button"
      onClick={() => {
        setFilterTerm('');
        setSortBy('createdAt');
        setSortDirection('desc');
        setFilterError('');
      }}
    >
      Reset Filters
    </button>
  </div>
)}

      {/* Display loading state while fetching todos */}
      {isTodoListLoading && <p>Loading todos...</p>}

      {/* Allow users to change server-side sorting options */}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      {/* Allow users to search todos by title */}
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      {/* Pass the addTodo handler to TodoForm */}
      <TodoForm onAddTodo={addTodo} />

      {/* Pass the todo list, cache version, and handlers to TodoList */}
      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;