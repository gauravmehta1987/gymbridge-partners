import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import config from '../../config'
import axios from 'axios'
import { Segment } from 'semantic-ui-react'
import './SessionBooking.css'

function PreviousBooking(){

   const [slotDetails, setSlotDetails] = useState([])
   const [loader, setLoader] = useState(false)
   let dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

   const fetchSlotsData = () => {
      setLoader(true)
      let url = config.appApiLink + "bookings/0?start=0&length=20"
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
            console.log(response.data)
            if(response.data.data && response.data.data.length){
               response.data.data.forEach(function(v){
                  let newDate = v.Date.toString()
                  let yy = newDate.substr(0, 4)
                  let mm = newDate.substr(4, 2)
                  let dd = newDate.substr(6, 2)
                  v.datview = dd+'/'+mm+'/'+yy
               })
               setSlotDetails(response.data.data)
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
      } );
   }

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

   useEffect(() => {
      fetchSlotsData();
    },[]);

   return (
      <>
      <Navbar name={'Previous Bookings'} />
      {loader && <Segment className="loader"></Segment>}
         <div className="container dashboard">
            <div className="session-info">
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                     {slotDetails && slotDetails.length > 0 ? 
                     slotDetails.map((slot, id) => (
                     <li className="mbr-gallery-filter-all" key={'slot' + id}>
                        <div className="btn btn-md btn-primary-outline display-4 mt-0">
                        
                              <div className="day-info">
                                 <div className="center-align center-view">
                                    {slot.session && slot.session.sessionMaster && <span>{dayName[slot.session.sessionMaster.DayId]}</span>}
                                    <span className="lchild pre">{slot.datview}</span>
                                    <div className="text-right">Booking Id: <b>{slot.BookingId}</b></div>
                                    <div className="more-info">
                                       {slot.session && <span className="timeinfo">{getTime(slot.session.StartMinute, slot.session.EndMinute)}</span>}
                                       {slot.bookingStatus && <span className="tmName">{slot.bookingStatus.Name}</span>}
                                    </div>
                                 </div>
                              </div>
                           
                        {/* :<div className="nobooking">No bookings</div>} */}
                        </div>
                     </li>
                     )) : null}
                  </ul>
               </div>
            </div>
         </div>
      </>
   )
}

export default PreviousBooking