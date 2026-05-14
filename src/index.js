import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

document.documentElement.removeAttribute('data-theme');

const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
const vampireWarsFont = `${publicUrl}/fonts/VampireWars.ttf`;
if (!document.querySelector('style[data-font-vampire-wars]')) {
  const fontStyle = document.createElement('style');
  fontStyle.setAttribute('data-font-vampire-wars', '1');
  fontStyle.textContent = `@font-face{font-family:"VampireWars";src:url("${vampireWarsFont}")format("truetype");font-weight:normal;font-style:normal;font-display:swap;}`;
  document.head.appendChild(fontStyle);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
