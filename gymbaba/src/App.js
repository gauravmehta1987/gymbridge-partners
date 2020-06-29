import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Auth/Login';
import Home from './components/home';

function App() {

  const [userDetail, setUserDeatil] = React.useState('');

  useEffect(() => {
    if(localStorage.getItem('token') && localStorage.getItem('userDetails')){
      let userInfo = JSON.parse(localStorage.getItem('userDetails'));
      console.log(userInfo)
      setUserDeatil(userInfo)
      console.log(userDetail)
    }
  },[]);

  return (
    <BrowserRouter>    
      <div className="App">
          {userDetail? 
          // <Switch>
            <Route exact path="/" >
              <Home />
            </Route>
          // </Switch>
          : 
            <Route exact path="/Login">
              <Login />
            </Route>
          }
      </div>
    </BrowserRouter>
    
  );
}

export default App;
