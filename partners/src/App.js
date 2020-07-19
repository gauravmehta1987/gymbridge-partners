import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { Button } from 'semantic-ui-react';
import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import Login from './Auth/Login';
import Profile from './components/Profile/Profile';
import Slot from './components/Slot/Slot';
import Slotbooking from './components/Slot/Slotbooking'
import Home from './components/home/home';
// import Navbar from './components/navbar/Navbar';
// import Member from './components/Member';
import { useHistory } from 'react-router';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

function App() {

  const [userDetail, setUserDeatil] = React.useState('');
  const [auth, setAuth] = useState(false)
  const history = useHistory();
  // const pathname = window.location.pathname;

  const [checkStatus, setCheckStatus] = useState(false);

  setTimeout(function() {
    setCheckStatus(true)
    }, 100);

  const options = {
    timeout: 5000,
    position: positions.TOP_CENTER
  };

  useEffect(() => {
    if(localStorage.getItem('token') !== 'null' && localStorage.getItem('token')){
      let userInfo = JSON.parse(localStorage.getItem('userDetails'));
      console.log(userInfo)
      setUserDeatil(userInfo)
      setAuth(true)
    }else{
      setAuth(false)
        history.push({
          pathname:  "/login"
       })
    }
  },[history]);

  if(!auth){
    console.log('login page redirect')
    return (
      <Provider template={AlertTemplate} {...options}>
      <BrowserRouter>    
        {checkStatus && <div className="App">
            <Route path="/" component={Login} />
        </div>}
      </BrowserRouter>
      </Provider>
    )
  }

  console.log('else page')

  return (
    <Provider template={AlertTemplate} {...options}>
    <BrowserRouter>    
      <div className="App">
              
              {/* <Route exact path="/login" component={Login} /> */}
              <Route exact path="/Profile" component={Profile} />
              <Route exact path="/slot" component={Slot} />
              <Route exact path="/slotbooking/:days" component={Slotbooking} />
              <Route exact path="/" component={Home} />
              {/* <Route  render={() => <Redirect to={{pathname: "/"}} />} /> */}

      </div>
    </BrowserRouter>
    </Provider>
    
  );
}

export default App;
