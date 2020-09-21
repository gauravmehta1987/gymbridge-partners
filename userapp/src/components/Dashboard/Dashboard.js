import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import config from '../../config'
import axios from 'axios'
import { Segment } from 'semantic-ui-react'
import './Dashboard.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'

function Dashboard(){

   const [slotDetails, setSlotDetails] = useState('')
   const [slotDetailsTm, setSlotDetailsTm] = useState('')
   const [loader, setLoader] = useState(false)
   const [today, setToday] = useState({day: '', date: ''})
   const [tomorrow, setTomorrow] = useState({day: '', date: ''})
   const alert = useAlert()

   const fetchSlotsData = () => {
      setLoader(true)
      // let url = config.appApiLink + 'bookings/1?start=0&length=2'
      let url = config.appApiLink + 'userbookingstatus'
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.get( url, apiHeader )
      .then( response => {
         if(response.data && response.data.status === 'success'){
            // console.log(response.data.data)
            if(response.data.data && response.data.data.length){

               let today = new Date()
               let td = today.getFullYear()
               let mm1 = today.getMonth()+1
               if(mm1 < 10){
                  td += '0'+mm1
               }else {
                  td += mm1
               }
               if(today.getDate() < 10){
                  td += '0'+today.getDate()
               }else {
                  td += today.getDate()
               }

               var tomorrow = new Date();
               tomorrow.setDate(new Date().getDate()+1);
               let tmd = tomorrow.getFullYear()
               let mm2 = tomorrow.getMonth()+1
               if(mm2 < 10){
                  tmd += '0'+mm2
               }else {
                  tmd += mm2
               }
               if(tomorrow.getDate() < 10){
                  tmd += '0'+tomorrow.getDate()
               }else {
                  tmd += tomorrow.getDate()
               }

               response.data.data.forEach(function(v){
                  if(v.Date === parseInt(td)){
                     setSlotDetails(v)
                  }
                  if(v.Date === parseInt(tmd)){
                     setSlotDetailsTm(v)
                  }
               })
               
            }
            setLoader(false)
         }else {
            console.log('error')
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      alert.show("API gives an error, please login again")
      } );
   }

   useEffect(() => {
      var dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var d = new Date();
      setToday({
         ...today,
         day: dayName[d.getDay()],
         date: d.getDate() +'/'+ (d.getMonth()+1) +'/'+ d.getFullYear()
      })

      var tm = new Date();
      tm.setDate(new Date().getDate()+1);
      var n = new Date(tm);
      setTomorrow({
         ...tomorrow,
         day: dayName[n.getDay()],
         date: n.getDate() +'/'+ (n.getMonth()+1) +'/'+ n.getFullYear()
      })

      fetchSlotsData();
    },[]);

   const getTime = (st, en) => {
      var str = '';
      var stt1 = parseInt(parseInt(st)/60)
      var sttMin = parseInt(st)%60
      var ett1 = parseInt(parseInt(en)/60)
      var ettMin = parseInt(en)%60
   
      if(stt1 < 12){
         str += stt1+':'+(sttMin < 10 ? '0'+sttMin : sttMin)+'AM'
      }else if(stt1 === 12){
         str += stt1+':'+(sttMin < 10 ? '0'+sttMin : sttMin)+'PM'
      }else {
         str += ((stt1-12)+':'+(sttMin < 10 ? '0'+sttMin : sttMin))+'PM'
      }
      str += '-'
      if(ett1 < 12){
         str += ett1+':'+(ettMin < 10 ? '0'+ettMin : ettMin)+'AM'
      }else if(ett1 === 12){
         str += ett1+':'+(ettMin < 10 ? '0'+ettMin : ettMin)+'PM'
      }else {
         str += ((ett1-12)+':'+(ettMin < 10 ? '0'+ettMin : ettMin))+'PM'
      }

      return str
   }

   const cancelBooking = (e, id) => {
      e.preventDefault()
      confirmAlert({
         title: 'Cancel Booking ?',
         buttons: [
           {
             label: 'Cancel',
             className: 'confirm',
             onClick: () => {
               setLoader(true)
               let obj = {
                  bookingId: id
               }
               let url = config.appApiLink + 'session/cancel'
               let apiHeader = {
                  headers: {
                      'Content-Type': "application/json",
                      'accept': "application/json",
                      'Authorization': localStorage.getItem('token')
                  }
               }
               axios.put( url, obj, apiHeader )
               .then( response => {
                  if(response.data && response.data.status === 'success'){
                     console.log(response.data)
                     setLoader(false)
                     alert.show(response.data.message)
                     setTimeout(function(){
                        window.location.reload(false)
                     },1000)
                  }else {
                     console.log('error')
                     setLoader(false)
                     alert.show(response.data.message)
                  }
               })
               .catch( error => {
               setLoader(false)
               console.log(error);
               } );
             }
           },
           {
             label: 'Close',
             className: 'close',
             onClick: () => console.log('No')
           }
         ]
       });
   }

   return (
      <>
      <Navbar name={'Active Sessions'} />
      {loader && <Segment className="loader"></Segment>}
         <div className="container dashboard">
            {/* <div className="active-sessions">
               <Header as='h1'>Active Sessions</Header>
            </div> */}
            <div className="session-info">
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                     <li className="mbr-gallery-filter-all">
                        <div className="center" style={{margin: '10px 0'}}><b>Today's Booking</b></div>
                        <div className={"btn btn-md btn-primary-outline display-4 mt-0 "+ (slotDetails === '' ? 'nobook' : null)}>
                           <div className="day-info">
                              <div className="center-align center-view new-align">
                                 {slotDetails ? <><span>{today.day}</span><span className="lchild">{today.date}</span>
                                 <div className="center" style={{marginTop: '10px'}}>Booking Id: <b>{slotDetails.BookingId}</b></div>
                                 <div className="more-info">
                                    {slotDetails.session && <span>{getTime(slotDetails.session.StartMinute, slotDetails.session.EndMinute)}</span>}
                                    {slotDetails.bookingStatus && <span>{slotDetails.bookingStatus.Name}</span>}
                                 </div></>:<div className="nobooking">No booking</div>}
                              </div>
                              {slotDetails && slotDetails.bookingStatus && slotDetails.bookingStatus.Name === 'Active' && <div className="view-slot" onClick={(e) => cancelBooking(e, slotDetails.Id)}>Cancel</div>}
                           </div>
                        </div>
                     </li>
                     <li className="mbr-gallery-filter-all">
                     <div className="center" style={{margin: '10px 0', marginTop: '40px'}}><b>Tomorrow's Booking</b></div>
                        <div className={"btn btn-md btn-primary-outline display-4 mt-0 " + (slotDetailsTm === '' ? 'nobook' : null)}>
                           <div className="day-info">
                              <div className="center-align center-view new-align">
                                 {slotDetailsTm ? <><span>{tomorrow.day}</span><span className="lchild">{tomorrow.date}</span>
                                 <div className="center" style={{marginTop: '10px'}}>Booking Id: <b>{slotDetailsTm.BookingId}</b></div>
                                 <div className="more-info">
                                    {slotDetailsTm.session && <span>{getTime(slotDetailsTm.session.StartMinute, slotDetailsTm.session.EndMinute)}</span>}
                                    {slotDetailsTm.bookingStatus && <span>{slotDetailsTm.bookingStatus.Name}</span>}
                                 </div></>:<div className="nobooking">No booking</div>}
                              </div>
                              {slotDetailsTm && slotDetailsTm.bookingStatus && slotDetailsTm.bookingStatus.Name === 'Active' && <div className="view-slot" onClick={(e) => cancelBooking(e, slotDetailsTm.Id)}>Cancel</div>}
                           </div>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="moreinfos">
               <div className="book-session">
                  <NavLink to="/Planner">Workout Planner</NavLink>
               </div>
            </div>

            <div className="moreinfos">
               <div className="book-session">
                  <NavLink to="/SessionBooking">Click to book sessions</NavLink>
               </div>
               <div className="book-session">
                  <NavLink to="/PreviousBooking">Previous Bookings</NavLink>
               </div>
            </div>
         </div>
      </>
   )
}

export default Dashboard