import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Login from './Auth/Login';
import Home from './components/home';
import Navbar from './components/Navbar';
import Member from './components/Member';
import { useHistory } from 'react-router';

function App() {

  const [userDetail, setUserDeatil] = React.useState('');
  const history = useHistory();

  useEffect(() => {
    if(localStorage.getItem('token') && localStorage.getItem('userDetails')){
      let userInfo = JSON.parse(localStorage.getItem('userDetails'));
      console.log(userInfo)
      setUserDeatil(userInfo)
      console.log(userDetail)
    }
    else{
        // return <Redirect to="/login" />
        history.push({
          pathname:  "/login"
       })
    }
  },[]);

  return (
    <BrowserRouter>    
      <div className="App">
          <Navbar />
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} /> 
              {/* <Route exact path="/home" component={Home} /> */}
              {/* <Route exact path="/member" component={Member} /> */}
      </div>
    </BrowserRouter>
    
  );
}

export default App;
