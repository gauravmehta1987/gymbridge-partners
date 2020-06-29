import React from 'react';
import 'antd/dist/antd.css';
import './Navbar.css';
import { Drawer, Button, Radio, Space } from 'antd';
import { Icon } from 'semantic-ui-react';

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

  render() {
    const { placement, visible } = this.state;
    return (
      <>
        <Space style={{float:'left'}}>
          
          <Button type="default" onClick={this.showDrawer}>
            <i class="align justify icon"></i>
          </Button>
        </Space>
        <Drawer
          title="Basic Drawer"
          placement={placement}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key={placement}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </>
    );
  }
}