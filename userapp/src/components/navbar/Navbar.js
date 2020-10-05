import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Drawer, Space } from 'antd';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/auth';
import { Redirect } from 'react-router-dom';


function Navbar({name}){

  const { accessLevel,networkError, sendSignOutRequest} = useAuth();

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
          <div className="ant-btn ant-btn-button" type="button" onClick={showDrawer}>
            <i className="align justify icon"></i>
          </div>
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
        <NavLink className="navigation" to="/Profile">Profile</NavLink>
        <a className="navigation logout-new" onClick={logout}>Logout</a>

        <div className="info">
            <div className="text">
              To report an issue<br />
              Contact<br />
              <a href="tel:+91-8851393590">+91-8851393590</a>
              <a href="tel:+91-9873400053">+91-9873400053</a>
            </div>
          </div>
      </Drawer>
    </>
  );
}

export default Navbar
