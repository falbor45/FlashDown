import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

ReactDOM.hydrate(
  <App {...window.APP_STATE}/>,
  document.getElementById('root')
);