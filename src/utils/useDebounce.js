
import { useState, useEffect } from 'react';

// Custom hook to delay updating a value
function useDebounce(value, delay) {
  // Store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update the value after the specified delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the previous timer when dependencies change
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  // Return the delayed value
  return debouncedValue;
}

export default useDebounce;
