import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Drawer, Button, Space } from 'antd';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/auth';
import { Redirect } from 'react-router-dom';


function Navbar({name}){

  const {isLoading, accessLevel,networkError, sendSignOutRequest} = useAuth();

  const [state, setState] = useState({ visible: false, placement: 'left' })
  
  const showDrawer = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onClose = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  const logout = () => {
    sendSignOutRequest()
  }

  let serverErrorMessage = null;
    if ( networkError ) {
      serverErrorMessage = (
            <p style={{color: 'red'}}>{networkError}</p>
        );
    }

    let authRedirect = null;
    if ( accessLevel > 0 ) {
        authRedirect = <Redirect to="/dashboard" />
    }

  return (
    <>
    {authRedirect}
      {serverErrorMessage}
      <div className="navigation-menu">
        <Space style={{float:'left', position: 'relative', zIndex: 2}}>
          <Button type="default" onClick={showDrawer}>
            <i className="align justify icon"></i>
          </Button>
        </Space>
        <span className="head-name">{name}</span>
      </div>
      <Drawer
        title=""
        placement={state.placement}
        closable={false}
        onClose={onClose}
        visible={state.visible}
        key={state.placement}
        className="navbar"
      >
        <NavLink className="navigation" to="/">Home</NavLink>
        <a className="navigation logout-new" onClick={logout}>Logout</a>
      </Drawer>
    </>
  );
}

export default Navbar
