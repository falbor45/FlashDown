import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

const initialState = JSON.parse(document.getElementById('initial-state').getAttribute('data-json'));

ReactDOM.hydrate(
  <App {...initialState}/>,
  document.getElementById('root')
);