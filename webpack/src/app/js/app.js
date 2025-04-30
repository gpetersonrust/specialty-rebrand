import '../scss/app.scss'; // Import SCSS
import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ React 18 API
 
 

const root = ReactDOM.createRoot(document.getElementById('root'));
 
const App = () => { 

  return "Hello, World!";
};


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
