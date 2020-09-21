import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment } from 'semantic-ui-react'
import config from '../../config'
import axios from 'axios'
import './SessionBooking.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'

function SessionBooking(){

   const [slotsInfo, setSlotsInfo] = useState([])
   const [loader, setLoader] = useState(false)
   const [gymTime, setGymTime] = useState([])
   const [gymTimeTo, setGymTimeTo] = useState([])
   const [todaySLot, setTodaySLot] = useState([])
   const [tomorrowSLot, setTomorrowSLot] = useState([])
   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
   const [currentMin, setCurrentMin] = useState(0)
   const alert = useAlert()

   const fetchGymData = (d1, d2) => {
      setSlotsInfo('')
      setLoader(true)
      let dd1 = days.findIndex(x => (x === d1))
      let dd2 = days.findIndex(x => (x === d2))
      let url = config.appApiLink + 'sessions?gymId='+localStorage.getItem('gymId')
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
            console.log(response.data.data)
            setSlotsInfo(response.data.data)
            setLoader(false)

            // find slot session for today, tomorrow
            let slotTodayArr = []
            let slotTomorrowArr = []
            if(response.data.data.slots && response.data.data.slots.length){
               response.data.data.slots.map(function(e) { 
                  // if(e.days[0] === dd1){
                  if(e.DayId === dd1){
                     slotTodayArr.push(e)
                  }else {
                     slotTomorrowArr.push(e)
                  }
                })
                setTodaySLot(slotTodayArr)
                setTomorrowSLot(slotTomorrowArr)
            }


            // find timings for today, tomorrow
            let stArr = []
            let stArrTO = []
            if(response.data.data.gym && response.data.data.gym.slots && response.data.data.gym.slots.length){
               response.data.data.gym.slots.forEach(function(v){
                  var indx = stArr.findIndex(x => (x.Day === v.Day))
                  if(indx === -1 && dd1 === v.Day){
                     stArr.push(v)
                  }else if(dd1 === v.Day) {
                     stArr.push(v)
                  }

                  if(indx === -1 && dd2 === v.Day){
                     stArrTO.push(v)
                  }else if(dd2 === v.Day) {
                     stArrTO.push(v)
                  }
               })
               setGymTime(stArr)
               setGymTimeTo(stArrTO)
            }

         }else {
            console.log('error')
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );
    };

   useEffect(() => {
      var dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var d = new Date();
      var day1 = dayName[d.getDay()];
      var tomorrow = new Date();
      tomorrow.setDate(new Date().getDate()+1);
      var n = new Date(tomorrow);
      var day2 = dayName[n.getDay()];
      fetchGymData(day1, day2);
      let cmin = (new Date().getHours()*60) + new Date().getMinutes()
      setCurrentMin(cmin)
    },[]);

   const getTime = (st, en) => {
      var str = '';
      var stt1 = parseInt(parseInt(st)/60)
      var sttMin = parseInt(st)%60
      var ett1 = parseInt(parseInt(en)/60)
      var ettMin = parseInt(en)%60
   
      if(stt1 < 12){
         str += stt1+':'+(sttMin < 10 ? '0'+sttMin : sttMin)+' AM'
      }else if(stt1 === 12){
         str += stt1+':'+(sttMin < 10 ? '0'+sttMin : sttMin)+' PM'
      }else {
         str += ((stt1-12)+':'+(sttMin < 10 ? '0'+sttMin : sttMin))+' PM'
      }
      str += '-'
      if(ett1 < 12){
         str += ett1+':'+(ettMin < 10 ? '0'+ettMin : ettMin)+' AM'
      }else if(ett1 === 12){
         str += ett1+':'+(ettMin < 10 ? '0'+ettMin : ettMin)+' PM'
      }else {
         str += ((ett1-12)+':'+(ettMin < 10 ? '0'+ettMin : ettMin))+' PM'
      }

      return str
   }

   const bookSLot = (e, sessionId) => {
      e.preventDefault()
      confirmAlert({
         title: 'Confirm Booking ?',
         buttons: [
           {
             label: 'Confirm',
             className: 'confirm',
             onClick: () => {
               setLoader(true)
               let url = config.appApiLink+'session/book'
               let apiHeader = {
                  headers: {
                      'Content-Type': "application/json",
                      'accept': "application/json",
                      'Authorization': localStorage.getItem('token')
                  }
               };
               var obj = {
                  sessionId: sessionId
               }
               axios.post( url, obj, apiHeader )
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
             label: 'Cancel',
             className: 'cancel',
             onClick: () => console.log('No')
           }
         ]
       });
   }

   return (
      <>
      <Navbar name={'Book Session'} />
         {loader && <Segment className="loader"></Segment>}
         {slotsInfo && <div className="gym-container slot-content">
            {slotsInfo.gym && <h3 style={{float: 'left', width: '100%', paddingTop: '10px', fontSize: '1.5em', fontWeight: 'bold'}}>{slotsInfo.gym.name}</h3>}
            <div className="time-display">
               <div><b>Today's Gym Timings</b></div>
               {gymTime && gymTime.length > 0 && <div className='slot-view newtime'>
                  {gymTime.map((time, id) => (
                     <div key={"tm" + id} className="info">{getTime(time.StartTime, time.EndTime)}</div>
                  ))}
               </div>}
            </div>
            <div className="time-display" style={{paddingTop: 0}}>
               <div><b>Today's Gym Sessions</b></div>
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                  {todaySLot && todaySLot.length > 0 && todaySLot.map((card, i) => (
                     <li className="mbr-gallery-filter-all" key={"slot"+i}>
                        <div className={"btn btn-md btn-primary-outline display-4 md-btn " + (i=== 0 && 'first')}>
                           <div className="day-info mm-info">
                              <div className="center-align">
                                 {/* <div>Duration: {card.WorkoutDuration} mins</div> */}
                                 <div>Break Time: {card.BreakMinutes} mins</div>
                                 <div>Members Allowed: {card.MemberCount}</div>
                                 <div className="preview">
                                 {card.sessions.map((session, index) => (
                                    <div key={'st' + index} className={'slot ' + (session.EndMinute < currentMin ? 'all-booked' : session.SlotFilledPercent < 50 ? 'slot-green' : session.SlotFilledPercent >= 50 && session.SlotFilledPercent < 90 ? 'slot-yellow' : session.SlotFilledPercent >= 90 && session.SlotFilledPercent <= 99 ? 'slot-red': session.SlotFilledPercent === 100 ? 'all-booked' : null)} onClick={(e) => bookSLot(e, session.Id)}>
                                       <span>{index+1}</span>
                                       <div className="slot-more-info">{getTime(session.StartMinute, session.EndMinute)}</div>
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                  ))}
                  </ul>
                  {todaySLot.length === 0 && <div className="no-slot">No slots availbale for booking</div>}
               </div>
            </div>

            <div className="time-display">
               <div><b>Tomorrow's Gym Timings</b></div>
               {gymTimeTo && gymTimeTo.length > 0 && <div className='slot-view newtime'>
                  {gymTimeTo.map((time, id) => (
                     <div key={"tm" + id} className="info">{getTime(time.StartTime, time.EndTime)}</div>
                  ))}
               </div>}
            </div>
            <div className="time-display" style={{paddingTop: 0}}>
               <div><b>Tomorrow's Gym Sessions</b></div>
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                  {tomorrowSLot && tomorrowSLot.length > 0 && tomorrowSLot.map((card, i) => (
                     <li className="mbr-gallery-filter-all" key={"slot"+i}>
                        <div className={"btn btn-md btn-primary-outline display-4 md-btn " + (i=== 0 && 'first')}>
                           <div className="day-info mm-info">
                              <div className="center-align">
                                 {/* <div>Duration: {card.WorkoutDuration} mins</div> */}
                                 <div>Break Time: {card.BreakMinutes} mins</div>
                                 <div>Members Allowed: {card.MemberCount}</div>
                                 <div className="preview">
                                 {card.sessions.map((session, index) => (
                                    <div key={'st' + index} className={'slot ' + (session.SlotFilledPercent < 50 ? 'slot-green' : session.SlotFilledPercent >= 50 && session.SlotFilledPercent < 90 ? 'slot-yellow' : session.SlotFilledPercent >= 90 && session.SlotFilledPercent <= 99 ? 'slot-red': session.SlotFilledPercent === 100 ? 'all-booked' : null)} onClick={(e) => bookSLot(e, session.Id)}>
                                       <span>{index+1}</span>
                                       <div className="slot-more-info">{getTime(session.StartMinute, session.EndMinute)}</div>
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                  ))}
                  </ul>
                  {tomorrowSLot.length === 0 && <div className="no-slot">No slots availbale for booking</div>}
               </div>
            </div>

         </div>}
      </>
   )
}

export default SessionBooking