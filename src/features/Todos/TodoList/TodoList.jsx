import TodoListItem from './TodoListItem.jsx';
import { useMemo } from 'react';

// Destructure the new onCompleteTodo prop
function TodoList({
  todoList,
  dataVersion,
  onCompleteTodo,
  onUpdateTodo
}) {
  
// Recalculate filtered todos when the list or data version changes
  const filteredTodoList = useMemo(() => {

    return {
      version: dataVersion,
      todos: todoList.filter(todo => todo.isCompleted !== true)
    };
  }, [todoList, dataVersion]);

  return (
    // Display an empty message when there are no incomplete todos
    filteredTodoList.todos.length === 0 ? (
      <p>Add todo above to get started</p>
    ) : (
      // Render the list of incomplete todos
      <ul>
        {filteredTodoList.todos.map(todo => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>
    )
  );
}

export default TodoList;