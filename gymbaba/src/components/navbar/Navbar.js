import React from 'react';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Drawer, Button, Space } from 'antd';
import { NavLink } from 'react-router-dom';

export default class Navbar extends React.Component {
  state = { visible: false, placement: 'left' };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = e => {
    this.setState({
      placement: e.target.value,
    });
  };

  logout = e => {
    localStorage.setItem('userDetails', null);
    localStorage.setItem('token', null);
    if(!this.props || !this.props.hasOwnProperty('history')){
      this.props = {
        history: []
      }
    }
    this.props.history.push("/login");
  }

  render() {
    const { placement, visible } = this.state;
    
    return (
      <>
        <div className="navigation-menu">
          <Space style={{float:'left', position: 'relative', zIndex: 2}}>
            <Button type="default" onClick={this.showDrawer}>
              <i className="align justify icon"></i>
            </Button>
          </Space>
          <span className="head-name">{this.props.name}</span>
        </div>
        <Drawer
          title=""
          placement={placement}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key={placement}
          className="navbar"
        >
          <NavLink className="navigation" to="/">Home</NavLink>
          <NavLink className="navigation" to="/Profile">Profile</NavLink>
          <a className="navigation logout-new" onClick={this.logout}>Logout</a>
          {/* <p>Members</p>
          <p>Trainers</p>
          <p>Requests</p>
          <p>Enquiries</p> */}
        </Drawer>
      </>
    );
  }
}
