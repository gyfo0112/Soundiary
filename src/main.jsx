import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/dark.css';
import './styles/responsive.css';
import { AudioProvider } from './context/AudioContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>,
);