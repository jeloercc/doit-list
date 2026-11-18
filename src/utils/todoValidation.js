/**
 * Validate todo title
 * Returns true if the title is not empty after trimming whitespace
 */
export function isValidTodoTitle(title) {
  return title.trim() !== '';
}