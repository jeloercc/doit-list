import { useState } from 'react';

// Receive authentication state setters from App
function Logon({ onSetEmail, onSetToken }) {
    
  // Store the email entered by the user
  const [email, setEmail] = useState('');
  // Store the password entered by the user
  const [password, setPassword] = useState('');
  // Store authentication error messages
  const [authError, setAuthError] = useState('');
  // Track whether the login request is in progress
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  
   // Handle the login form submission
  const handleSubmit = async (event) => {
    // Prevent the page from reloading
    event.preventDefault();

    // Start the loading state
    setIsLoggingOn(true);

  // Send credentials to the API
  try {
    const response = await fetch('/api/users/logon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.status === 200 && data.email && data.csrfToken) {
      onSetEmail(data.email);
      onSetToken(data.csrfToken);
    } else {
      setAuthError(`Authentication failed: ${data?.message}`);
    }
  } catch (error) {
    setAuthError(`Error: ${error.name} | ${error.message}`);
  } finally {
    // Stop the loading state
    setIsLoggingOn(false);
  }
};
 return (
  <div>
    <h2>Log On</h2>

    {/* Display authentication errors */}
    {authError && <p>{authError}</p>}

    <form onSubmit={handleSubmit}>
      {/* Email input */}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      {/* Password input */}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      {/* Disable the button while logging on */}
      <button type="submit" disabled={isLoggingOn}>
        {isLoggingOn ? 'Logging in...' : 'Log On'}
      </button>
    </form>
  </div>
 );
}
export default Logon;