import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';
// import 'antd/dist/antd.css';
import './Home.css'
// import Navbar from './Navbar';

function Home(){
   return (
      <>
      {/* <Navbar /> */}
      <div className="container">
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
               <i className="fas fa-dumbbell card-img members icon"></i>
               <Card.Header>Trainers</Card.Header>
               <Card.Meta>
               <span className='date'>Total trainers in the gym</span>
               </Card.Meta>
            </Card.Content>
            <Card.Content extra>
               <div className="extra-details active">
                  <span>Trainers</span>
                  <span className="number">120</span>
               </div>
               <div className="extra-details inactive">
                  <span>PTs</span>
                  <span className="number">35</span>
               </div>
            </Card.Content>
         </Card>
      </div>
      </>
   )
}

export default Home;