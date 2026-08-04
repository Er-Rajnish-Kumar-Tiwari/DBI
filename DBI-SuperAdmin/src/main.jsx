import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './assets/prism.css';
import { AppContextProvider } from './Context/AppContext.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
);
