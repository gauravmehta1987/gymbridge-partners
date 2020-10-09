import React, { useEffect } from 'react'
import { Card, Icon, Button, Segment } from 'semantic-ui-react'
import './Home.css'
import 'antd/dist/antd.css'
import Request from './Request'
import Enquiry from './Enquiry'
import Navbar from '../navbar/Navbar'
import { useHistory } from 'react-router'
import { useState } from 'react'
import axios from 'axios'
import config from '../../config'
import { useAlert } from 'react-alert'

function Home(){

   const history = useHistory();

   const gotoSlot = (e) => {
      e.preventDefault()
      history.push({
         pathname:  "/slot"
      })
   }

   const gotoSlotStats = (e) => {
      e.preventDefault()
      // history.push({
      //    pathname:  "/slotView"
      // })
      history.push({
         pathname:  "/SlotSessions"
      })
   }

   const gotoWorkOutStats = (e) => {
      e.preventDefault()
      history.push({
         pathname:  "/WorkoutStats"
      })
   }

   const addNewMember = (e) => {
      e.preventDefault()
      history.push({
         pathname:  "/addmember"
      })
   }

   const addNewTrainer = (e) => {
      e.preventDefault()
      history.push({
         pathname:  "/trainers"
      })
   }

   const gotoMember = (e) => {
      e.preventDefault()
      history.push({
         pathname:  "/members"
      })
   }

   const alert = useAlert()

   const [bookingId, setBookingId] = useState('')
   const [loader, setLoader] = useState(false)

   const setBooking = (e) => {
      setBookingId(e.target.value)
   }

   const checkBooking = () => {
      setLoader(true)
      let url = config.appApiLink + 'booking/attend'
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      }
      let obj = {
         bookingId: bookingId
      }
      axios.post( url, obj, apiHeader )
      .then( response => {
         if(response.data && response.data.status === 'success'){
            console.log(response.data.data)
            setLoader(false)
            alert.show(response.data.message)
         }else {
            setLoader(false)
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );
   }

   const [activeMembers, setActiveMembers] = useState(0)
   const [inactiveMembers, setInactiveMembers] = useState(0)

   const membersCount = () => {
      setLoader(true)
      let url = config.appApiLink + 'member/getgymmembercount'
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      }
      axios.get( url, apiHeader )
      .then( response => {
         if(response.data && response.data.status === 'success'){
            if(response.data.data){
               setActiveMembers(response.data.data.memberCount)
               setInactiveMembers(response.data.data.inactiveCount)
            }
            setLoader(false)
         }else {
            setLoader(false)
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );
   }

   useEffect(() => {
      membersCount()
   },[])

   return (
      <>
      {loader && <Segment className="loader"></Segment>}
      <Navbar name={'Dashboard'} />
      <div className="container home-content">

         <div className="check-booking">
            <div className="field">
               {/* <label htmlFor="bookingId">Booking Id</label> */}
               <div className="ui input">
                  <input id="bookingId" value={bookingId} placeholder="Booking Id" onChange={setBooking} />
               </div>
               <Button color='green' onClick={checkBooking} >Check Booking</Button>
            </div>
         </div>

         <div className="slot-link">
            <div className="slot-link-in" onClick={gotoSlot}>
               <div>Create</div>
               <div>Session</div>
            </div>
            <div className="slot-link-in" onClick={gotoSlotStats} style={{marginLeft: '10px'}}>
               <div>Session</div>
               <div>Stats</div>
            </div>
            <div className="slot-link-in" onClick={gotoWorkOutStats} style={{marginLeft: '10px'}}>
               <div>Workout</div>
               <div>Stats</div>
            </div>
            <div className="slot-link-in" onClick={addNewMember} style={{marginLeft: '10px'}}>
               <div>Add</div>
               <div>Member</div>
            </div>
            <div className="slot-link-in" onClick={addNewTrainer} style={{marginLeft: '10px'}}>
               <div>Add/View</div>
               <div>Trainer</div>
            </div>
         </div>

         <div className="mamber-trainer-card clearfix">
            <Card className="card-details" onClick={gotoMember}>
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
                     <span className="number">{activeMembers}</span>
                  </div>
                  <div className="extra-details inactive">
                     <span>Inactive</span>
                     <span className="number">{inactiveMembers}</span>
                  </div>
               </Card.Content>
            </Card>

            <Card className="card-details blur">
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