// Add onCompleteTodo to the props using destructuring
function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      {/* Add the checkbox input inside the list item */}
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
      />
      {todo.title}
    </li>
  );
}

export default TodoListItem;