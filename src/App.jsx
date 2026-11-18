import { useState } from 'react';
import './App.css';
import Header from './shared/Header.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import Logon from './features/Logon.jsx';

function App() {
  // Store the authenticated user's email
  const [, setEmail] = useState('');
  // Store the CSRF token returned by the API
  const [token, setToken] = useState('');

  return (
    <div>
      {/* Display the application header */}
      <Header
        token={token}
        onSetToken={setToken}
        onSetEmail={setEmail}
      />

      {/* Show TodosPage when authenticated, otherwise show Logon */}
      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon
          onSetEmail={setEmail}
          onSetToken={setToken}
        />
      )}
    </div>
  );
}

export default App;