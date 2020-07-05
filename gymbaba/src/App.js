import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
// import { Button } from 'semantic-ui-react';
import { BrowserRouter, Route} from 'react-router-dom';
import Login from './Auth/Login';
import Profile from './components/Profile/Profile';
import Slot from './components/Slot/Slot';
import Slotbooking from './components/Slot/Slotbooking'
import Home from './components/home/home';
// import Navbar from './components/navbar/Navbar';
// import Member from './components/Member';
import { useHistory } from 'react-router';

function App() {

  // const [userDetail, setUserDeatil] = React.useState('');
  const history = useHistory();
  // const pathname = window.location.pathname;

  useEffect(() => {
    // console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token') !== 'null' && localStorage.getItem('token')){
      // let userInfo = JSON.parse(localStorage.getItem('userDetails'));
      // console.log(userInfo)
      // setUserDeatil(userInfo)
    }else{
      // console.log('no local')
        history.push({
          pathname:  "/login"
       })
    }
  },[history]);

  return (
    <BrowserRouter>    
      <div className="App">
          {/* {!pathname.includes('login')?<Navbar />:null} */}
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/Profile" component={Profile} />
              <Route exact path="/slot" component={Slot} />
              <Route exact path="/slotbooking/:days" component={Slotbooking} />
      </div>
    </BrowserRouter>
    
  );
}

export default App;
