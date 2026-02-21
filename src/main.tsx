import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(AuthProvider, null,
      React.createElement(App, null)
    )
  )
);
