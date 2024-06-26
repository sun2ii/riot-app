import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import './css/global.css'; // Import the global styles
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
