import React from 'react'
import { Card, Icon } from 'semantic-ui-react'
import './Home.css'
import 'antd/dist/antd.css'
import Request from './Request'
import Enquiry from './Enquiry'
import Navbar from '../navbar/Navbar'
import { useHistory } from 'react-router'

function Home(){

   const history = useHistory();

   const gotoSlot = (e) => {
      e.preventDefault()
      history.push({
         pathname:  "/slot"
      })
   }
   return (
      <>
      <Navbar name={'Dashboard'} />
      <div className="container home-content">

         <div className="slot-link">
            <div className="slot-link-in" onClick={gotoSlot}>
               <div>Covid 19</div>
               <div>Slot Booking</div>
            </div>
         </div>

         <div className="mamber-trainer-card clearfix">
            <Card className="card-details">
               <Card.Content>
                  <Icon disabled name='users' className="card-img members" />
                  <Card.Header>Members</Card.Header>
                  <Card.Meta>
                  <span className='date'>Total members of the gym</span>
                  </Card.Meta>
               </Card.Content>
               <Card.Content extra>
                  <div className="extra-details active">
                     <span>Active</span>
                     <span className="number">120</span>
                  </div>
                  <div className="extra-details inactive">
                     <span>Inactive</span>
                     <span className="number">35</span>
                  </div>
               </Card.Content>
            </Card>

            <Card className="card-details">
               <Card.Content>
                  <Icon disabled name='odnoklassniki' className="card-img trainers" />
                  <Card.Header>Trainers</Card.Header>
                  <Card.Meta>
                  <span className='date'>Total trainers in the gym</span>
                  </Card.Meta>
               </Card.Content>
               <Card.Content extra>
                  <div className="extra-details trainers">
                     <span>Trainers</span>
                     <span className="number">120</span>
                  </div>
                  <div className="extra-details pi">
                     <span>PTs</span>
                     <span className="number">35</span>
                  </div>
               </Card.Content>
            </Card>
         </div>

         <Request />
         <Enquiry />
      </div>
      </>
   )
}

export default Home;