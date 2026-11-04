import TodoListItem from './TodoListItem.jsx';
// Destructure the new onCompleteTodo prop
function TodoList({ todoList, onCompleteTodo }) {
  
// Create filteredTodoList filtering out completed items
const filteredTodoList = todoList.filter(todo => todo.isCompleted !== true);
return (
    // Check if the todoList array is empty
    filteredTodoList.length === 0 ? (
      // If true, render the empty state message
      <p>Add todo above to get started</p>
    ) : (
      // If false, render the unordered list with the mapped todos[cite: 1]
      <ul>
        {/* Map over filteredTodoList instead of todoList */}
        {filteredTodoList.map(todo => 
         <TodoListItem 
           key={todo.id} 
           todo={todo} 
           onCompleteTodo={onCompleteTodo} // Pass handler to child
          />
        )}
      </ul>
    )
  );
}

export default TodoList;