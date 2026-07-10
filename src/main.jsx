import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

document.title = 'HireMeFirst';
let metaDescription = document.querySelector('meta[name="description"]');
if (!metaDescription) {
  metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  document.head.appendChild(metaDescription);
}
metaDescription.content = 'HireMeFirst - The zero-shadow minimalist recruitment platform.';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
