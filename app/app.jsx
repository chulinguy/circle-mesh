import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import  Main from './components/Main.jsx';
import history from './history.js';

render((
  <BrowserRouter>
    <Main history={history}/>
  </BrowserRouter>), 
document.getElementById('app'));