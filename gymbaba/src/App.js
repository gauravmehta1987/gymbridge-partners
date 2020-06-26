import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'semantic-ui-react';

function App() {
  return (
    <div className="App">
            <Button content='Primary' primary />
            <Button content='Secondary' secondary />
    </div>
  );
}

export default App;
