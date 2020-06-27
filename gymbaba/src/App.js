import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'semantic-ui-react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './Auth/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Login />
      </div>
    </BrowserRouter>
    
  );
}

export default App;
