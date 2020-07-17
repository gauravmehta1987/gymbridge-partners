import React from 'react'
import Navbar from '../navbar/Navbar'
import { Header } from 'semantic-ui-react'
import './Dashboard.css'
import { Card, Button } from 'antd'

function Dashboard(){

   return (
      <>
      <Navbar name={'Dashboard'} />
         <div className="container dashboard">
            <div className="active-sessions">
               <Header as='h1'>First Header</Header>
            </div>
            <div className="session-info">
               {/* <Card.Group>
                  <Card>
                     <Card.Content>
                        <Card.Header>Steve Sanders</Card.Header>
                        <Card.Meta>Friends of Elliot</Card.Meta>
                        <Card.Description>
                           Steve wants to add you to the group <strong>best friends</strong>
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                        <div className='ui two buttons'>
                           <Button basic color='green'>
                              Approve
                           </Button>
                           <Button basic color='red'>
                              Decline
                           </Button>
                        </div>
                     </Card.Content>
                  </Card>
               </Card.Group> */}
            </div>
         </div>
      </>
   )
}

export default Dashboard