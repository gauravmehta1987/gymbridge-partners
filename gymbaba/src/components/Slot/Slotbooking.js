import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Loader, Segment, Checkbox, Button } from 'semantic-ui-react'
import config from '../../config';
import axios from 'axios'
import '../Profile/Profile.css'
import './Slot.css'
import { useHistory } from 'react-router'

function Slotbooking(){

   const [Monday, setMonday] = useState(false)
   const [Tuesday, setTuesday] = useState(false)
   const [Wednesday, setWednesday] = useState(false)
   const [Thursday, setThursday] = useState(false)
   const [Friday, setFriday] = useState(false)
   const [Saturday, setSaturday] = useState(false)
   const [Sunday, setSunday] = useState(false)

   const days = ["Select day", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
   const daysInSys = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   const durationValues = [{
      value: '30',
      display: '0:30 hour'
   },{
      value: '60',
      display: '1 hour'
   },{
      value: '90',
      display: '1:30 hours'
   },{
      value: '120',
      display: '2 hours'
   },{
      value: '150',
      display: '2:30 hours'
   },{
      value: '180',
      display: '3 hours'
   },{
      value: '210',
      display: '3:30 hours'
   },{
      value: '240',
      display: '4 hours'
   }]

   const timings = [
      {"name": "1:00","hour": 1},
      {"name": "2:00","hour": 2},
      {"name": "3:00","hour": 3},
      {"name": "4:00","hour": 4},
      {"name": "5:00","hour": 5},
      {"name": "6:00","hour": 6},
      {"name": "7:00","hour": 7},
      {"name": "8:00","hour": 8},
      {"name": "9:00","hour": 9},
      {"name": "10:00","hour": 10},
      {"name": "11:00","hour": 11},
      {"name": "12:00","hour": 12}
   ];

   const sanitizeValues = ["5", "10", "15", "20", "25", "30"]

   // const [session_from, setSession_from] = useState("")
   // const [session_to, setSession_to] = useState("")
   const [duration, setDuration] = useState(durationValues[0].value)
   const [sanitize, setSanitize] = useState(sanitizeValues[0])
   const [members, setMembers] = useState(0)
   const [startString, setStartString] = useState("")
   const [endString, setEndString] = useState("")

   const history = useHistory()

   const [daysInfo, setDaysInfo] = useState("")
   const [slots, setSlots] = useState([])
   const [status, setStatus] = useState(false)
   const [addSlot, setAddSlot] = useState(false)

   const getSlotsData = () => {
      let url = config.appApiLink+'session/8'
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.get( url, apiHeader )
      .then( response => {
         if(response.data && response.data.status){
            console.log(response.data.data)
            setSlots(response.data.data)
            setStatus(true)
         }
      })
      .catch( error => {
      console.log(error);
      } );
   }

   useEffect(() => {
      setDaysInfo(history.location.pathname)
      getSlotsData()
    },[]);

   const sessionSLot = (e, val) => {
      if(val === 'from'){
         // setSession_from(e.target.value)
         setStartString("")
         if(e.target.value === "Select day"){
            return false
         }

         let currentDay = daysInSys[new Date().getDay()]
         let stDate = '';

         if(e.target.value === currentDay){
            stDate = new Date()
         }else{
            let i = 0;
            for (i = 1; i < daysInSys.length; i++) {
               if(e.target.value === daysInSys[i]){
                  break
               }
            }
            let date = new Date()
            date.setDate(date.getDate() + i)
            stDate = new Date(date)
         }

         let mm = parseInt(stDate.getMonth()+1)
         if(mm < 10){
            mm = "0"+mm
         }
         let dd = parseInt(stDate.getDate())
         if(dd < 10){
            dd = "0"+dd
         }
         let stString = stDate.getFullYear()+""+mm+""+dd
         setStartString(stString)
      }else if(val === 'to'){
         // setSession_to(e.target.value)
         setEndString("")
         if(e.target.value === "Select day"){
            return false
         }

         let stDate1 = '';

         let j = 0;
         for (j = 1; j < daysInSys.length; j++) {
            if(e.target.value === daysInSys[j]){
               break
            }
         }
         let date1 = new Date()
         date1.setDate(date1.getDate() + j)
         stDate1 = new Date(date1)

         let mm1 = parseInt(stDate1.getMonth()+1)
         if(mm1 < 10){
            mm1 = "0"+mm1
         }
         let dd1 = parseInt(stDate1.getDate())
         if(dd1 < 10){
            dd1 = "0"+dd1
         }
         let endString = stDate1.getFullYear()+""+mm1+""+dd1
         setEndString(endString)
      }else if(val === 'duration'){
         setDuration(e.target.value)
      }else if(val === 'sanitize'){
         setSanitize(e.target.value)
      }else if(val === 'members'){
         setMembers(e.target.value)
      }
   }

   const daysCheck = (e, day) => {
      e.preventDefault()
      if(day === 'Monday'){
         const day1 = !Monday
         setMonday(day1)
      }else if(day === 'Tuesday'){
         const day2 = !Tuesday
         setTuesday(day2)
      }else if(day === 'Wednesday'){
         const day3 = !Wednesday
         setWednesday(day3)
      }else if(day === 'Thursday'){
         const day4 = !Thursday
         setThursday(day4)
      }else if(day === 'Friday'){
         const day5 = !Friday
         setFriday(day5)
      }else if(day === 'Saturday'){
         const day6 = !Saturday
         setSaturday(day6)
      }else if(day === 'Sunday'){
         const day7 = !Sunday
         setSunday(day7)
      }
   }

   const suggestions = (e) => {
      e.preventDefault()

      if(!Monday && !Tuesday && !Wednesday && !Thursday && !Friday && !Saturday && !Sunday){
         return false
      }
      if(startString === "" || endString === "")
      return false

      let stt = 0;
      if(key === 'AM'){
         stt = parseInt(startTime)*60
      }else{
         stt = parseInt(startTime)*12*60
      }

      let ett = 0;
      if(key1 === 'AM'){
         ett = parseInt(endingTime)*60
      }else{
         ett = parseInt(endingTime)*12*60
      }

      // console.log(startString,endString,duration, sanitize,members)

      // let params = "?gymId=8&fromDate="+startString+"&endDate="+endString+"&startTime="+stt+"&endTime="+ett+"&workoutTime="+duration+"&breakTime="+sanitize

      // let url = config.appApiLink+'session/suggestion'+params;
      // let apiHeader = {
      //    headers: {
      //        'Content-Type': "application/json",
      //        'accept': "application/json",
      //        'Authorization': localStorage.getItem('token')
      //    }
      // };
      // axios.get( url, apiHeader )
      // .then( response => {
      //    if(response.data && response.data.status){
      //       console.log(response.data)
      //    }
      // })
      // .catch( error => {
      // console.log(error);
      // } );
   }

   const [startTime, setStartTime] = useState("")
   const [endingTime, setEndTime] = useState("")
   const [key, setKey] = useState("AM")
   const [key1, setKey1] = useState("AM")

   const stTime = (e) => {
      setStartTime(e.target.value)
   }
   const stAMPM = (e) => {
      setKey(e.target.value)
   }
   const edTime = (e) => {
      setEndTime(e.target.value)
   }
   const stAMPM1 = (e) => {
      setKey1(e.target.value)
   }
   const addNewSlot = (e) => {
      // reset all the form values 
      setDuration(durationValues[0].value)
      setSanitize(sanitizeValues[0])
      setMembers(0)
      setStartString("")
      setEndString("")
      setStartTime("")
      setEndTime("")
      setMonday(false)
      setTuesday(false)
      setWednesday(false)
      setThursday(false)
      setFriday(false)
      setSaturday(false)
      setSunday(false)
      // hiding form
      setAddSlot(true)
   }
   const backToSlots = (e) => {
      setAddSlot(false)
   }

   return (
      <>
      <Navbar name={'Slot Booking'} />
      <div className="clearfix gym-main-div">
            {status?<div className="gym-container slot-content">
               <h3>Gym Name</h3>

               {addSlot?<div className="slot-form">
                  <form className="ui form">
                     <div className='timeline'>
                        <div className="field single-field">
                           <label htmlFor="repeat-on" style={{marginBottom: '20px'}}>Repeat On</label>
                           {daysInfo.includes('Monday')&&<div className="ui input">
                           <Checkbox label="Every Monday" checked={Monday} onChange={(e) => daysCheck(e, 'Monday')} /><br />
                           </div>}
                           {daysInfo.includes('Tuesday')&&<div className="ui input">
                           <Checkbox label="Every Tuesday" checked={Tuesday} onChange={(e) => daysCheck(e, 'Tuesday')} />
                           </div>}
                           {daysInfo.includes('Wednesday')&&<div className="ui input">
                           <Checkbox label="Every Wednesday" checked={Wednesday} onChange={(e) => daysCheck(e, 'Wednesday')} />
                           </div>}
                           {daysInfo.includes('Thursday')&&<div className="ui input">
                           <Checkbox label="Every Thursday" checked={Thursday} onChange={(e) => daysCheck(e, 'Thursday')} />
                           </div>}
                           {daysInfo.includes('Friday')&&<div className="ui input">
                           <Checkbox label="Every Friday" checked={Friday} onChange={(e) => daysCheck(e, 'Friday')} />
                           </div>}
                           {daysInfo.includes('Saturday')&&<div className="ui input">
                           <Checkbox label="Every Saturday" checked={Saturday} onChange={(e) => daysCheck(e, 'Saturday')} />
                           </div>}
                           {daysInfo.includes('Sunday')&&<div className="ui input">
                           <Checkbox label="Every Sunday" checked={Sunday} onChange={(e) => daysCheck(e, 'Sunday')} />
                           </div>}
                        </div>
                     </div>
                     {/* <div className='timeline'>
                        <div className="field">
                           <label htmlFor="session-from">Session From</label>
                           <div className="ui input">
                           <select id="session-from" value={session_from} onChange={(e) => sessionSLot(e, 'from')}>
                              {days.map((option, id) => (
                                 <option key={"fr" + id} value={option}>{option}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="session-to">Session to</label>
                           <div className="ui input">
                           <select id="session-to" value={session_to} onChange={(e) => sessionSLot(e, 'to')}>
                              {days.map((option, id) => (
                                 <option key={"to" + id} value={option}>{option}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                     </div> */}
                     <div className='timeline'>
                        <div className="field">
                           <label htmlFor="start-time">Start TIme</label>
                           <div className="ui input">
                           <select id="start-time" value={startTime} onChange={stTime}>
                              {timings.map((option, id) => (
                                 <option key={"tt" + id} value={option.hour}>{option.name}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="start">AM/PM</label>
                           <div className="ui input">
                           <select id="start" value={key} onChange={stAMPM}>
                              <option value='AM'>AM</option>
                              <option value='PM'>PM</option>
                           </select>
                           </div>
                        </div>
                     </div>
                     <div className='timeline'>
                        <div className="field">
                           <label htmlFor="end-time">End TIme</label>
                           <div className="ui input">
                           <select id="end-time" value={endingTime} onChange={edTime}>
                              {timings.map((option, id) => (
                                 <option key={"tt" + id} value={option.hour}>{option.name}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="end">AM/PM</label>
                           <div className="ui input">
                           <select id="end" value={key1} onChange={stAMPM1}>
                              <option value='AM'>AM</option>
                              <option value='PM'>PM</option>
                           </select>
                           </div>
                        </div>
                     </div>
                     <div className='timeline'>
                        <div className="field single-field">
                           <label htmlFor="Duration">Workout Duration</label>
                           <div className="ui input">
                           <select id="Duration" value={duration} onChange={(e) => sessionSLot(e, 'duration')}>
                              {durationValues.map((option, id) => (
                                 <option key={"du" + id} value={option.value}>{option.display}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                     </div>
                     <div className='timeline'>
                        <div className="field">
                           <label htmlFor="sanitize">Break Time</label>
                           <div className="ui input">
                           <select id="sanitize" value={sanitize} onChange={(e) => sessionSLot(e, 'sanitize')}>
                              {sanitizeValues.map((option, id) => (
                                 <option key={"sa" + id} value={option}>{option}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="members">Members Allowed</label>
                           <div className="ui input">
                              <input id="members" value={members} onChange={(e) => sessionSLot(e, 'members')} />
                           </div>
                        </div>
                     </div>
                     <Button color='black' onClick={backToSlots}>
                        Back
                     </Button>
                     <Button color='green' onClick={suggestions}>
                        Suggestions
                     </Button>
                  </form>
               </div>:
                  <div className="add-new">
                     <Button color='green' onClick={addNewSlot}>
                        Add Slot
                     </Button>
                  </div>
               }
            
            </div>:
            <Segment>
               <Loader active />
            </Segment>}
         </div>
      </>
   )
}

export default Slotbooking