import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js';

const initialState = JSON.parse(document.getElementById('initial-state').getAttribute('data-json'));

ReactDOM.hydrate(
  <BrowserRouter>
    <App {...initialState}/>
  </BrowserRouter>,
  document.getElementById('root')
);