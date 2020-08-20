import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Loader, Segment, Checkbox, Button, Modal, Header, Icon } from 'semantic-ui-react'
import config from '../../config';
import axios from 'axios'
import '../Profile/Profile.css'
import './Slot.css'
import { useHistory } from 'react-router'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import TimeRangeSlider from 'react-time-range-slider'
import 'react-time-range-slider/dist/styles.css'

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
      display: '0:30 Hours'
   },{
      value: '60',
      display: '1 Hour'
   },{
      value: '90',
      display: '1:30 Hours'
   },{
      value: '120',
      display: '2 Hours'
   },{
      value: '150',
      display: '2:30 Hours'
   },{
      value: '180',
      display: '3 Hours'
   },{
      value: '210',
      display: '3:30 Hours'
   },{
      value: '240',
      display: '4 Hours'
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
   // const [gym, setGym] = useState("")

   const history = useHistory()

   const [daysInfo, setDaysInfo] = useState("")
   const [slots, setSlots] = useState([])
   const [status, setStatus] = useState(false)
   const [addSlot, setAddSlot] = useState(false)

   const [gymTime, setGymTime] = useState([])

   const [loader, setLoader] = useState(false)
   const alert = useAlert()
   
   const getSlotsData = () => {
      let stArr = history.location.pathname.split('/')
      delete stArr.splice(0,1)
      delete stArr.splice(0,1)
      let newArr = stArr[0].split(',')
      let daysCommaValues = []
      for (let k = 0; k < newArr.length; k++) {
         daysCommaValues.push(days.findIndex(x => (x == newArr[k])) - 1)
      }

      setLoader(true)
      let url = config.appApiLink+'session/'+localStorage.getItem('gymId')+'/'+(daysCommaValues.join())
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
            setSlots(response.data.data)
            setStatus(true)
            setLoader(false)
            let stArr = []
            if(response.data.data.gym && response.data.data.gym.slots && response.data.data.gym.slots.length){
               response.data.data.gym.slots.forEach(function(v){
                  var indx = stArr.findIndex(x => (x.Day == v.Day))
                  if(indx === -1 && daysCommaValues[0] === v.Day){
                     stArr.push(v)
                  }else if(daysCommaValues[0] === v.Day) {
                     stArr.push(v)
                  }
               })
               setGymTime(stArr)
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
   }

   useEffect(() => {
      setDaysInfo(history.location.pathname)
      // if(localStorage.getItem('gymName')){
      //    setGym(localStorage.getItem('gymName'))
      // }
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

      let dayArr = []
      let repeatArr = []

      if(!Monday && !Tuesday && !Wednesday && !Thursday && !Friday && !Saturday && !Sunday){
         alert.show("Please select the days")
         return false
      }

      if(!members || members === 0){
         alert.show("Please add members")
         return false
      }
      
      if(Monday){
         dayArr.push(0)
         repeatArr.push(0)
      }
      if(Tuesday){
         dayArr.push(1)
         repeatArr.push(1)
      }
      if(Wednesday){
         dayArr.push(2)
         repeatArr.push(2)
      }
      if(Thursday){
         dayArr.push(3)
         repeatArr.push(3)
      }
      if(Friday){
         dayArr.push(4)
         repeatArr.push(4)
      }
      if(Saturday){
         dayArr.push(5)
         repeatArr.push(5)
      }
      if(Sunday){
         dayArr.push(6)
         repeatArr.push(6)
      }

      let st_t = stEnValue.start.split(':');
      let stt = (parseInt(st_t[0])*60)+parseInt(st_t[1])

      let et_t = stEnValue.end.split(':');
      let ett = (parseInt(et_t[0])*60)+parseInt(et_t[1])

      setLoader(true)

      let params = "?gymId="+localStorage.getItem('gymId')+"&days="+(dayArr)+"&repeats="+(repeatArr)+"&startTime="+(stt+1)+"&endTime="+ett+"&workoutTime="+duration+"&breakTime="+sanitize

      let url = config.appApiLink+'session/suggestion'+params;
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
            setSlotPreview(response.data.data[0])
            setSuggestionShow(true)
            setLoader(false)
         }else{
            setLoader(false)
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );
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

   const changeStartHandler = (time) => {
      // console.log(time)
   }

   const timeChangeHandler = (time) => {
      setStEnValue({...stEnValue, 
         start: time.start,
         end: time.end
      })
   }

   const changeCompleteHandler = (time) => {
      // console.log(time)
   }

   const [stEnValue, setStEnValue] = useState({
      start: "01:00",
      end: "23:59"
   })

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
      setStEnValue({...stEnValue, 
         start: "01:00",
         end: "23:59"
      })
   }
   const backToSlots = (e) => {
      setAddSlot(false)
   }
   
   const backToSlot =(e) => {
      e.preventDefault()
      history.push({
         pathname: '/slot'
      })
   }

   const [suggestionShow, setSuggestionShow] = useState(false)
   const [slotPreview, setSlotPreview] = useState([])

   const closeModal = () => {
      setSuggestionShow(false)
   }

   const saveSlot = (e) => {
      e.preventDefault()

      let dayArr1 = []
      let repeatArr1 = []

      if(!Monday && !Tuesday && !Wednesday && !Thursday && !Friday && !Saturday && !Sunday){
         alert.show("Please select the days")
         return false
      }

      if(!members || members === 0){
         alert.show("Please add members")
         return false
      }
      
      if(Monday){
         dayArr1.push(0)
         repeatArr1.push(0)
      }
      if(Tuesday){
         dayArr1.push(1)
         repeatArr1.push(1)
      }
      if(Wednesday){
         dayArr1.push(2)
         repeatArr1.push(2)
      }
      if(Thursday){
         dayArr1.push(3)
         repeatArr1.push(3)
      }
      if(Friday){
         dayArr1.push(4)
         repeatArr1.push(4)
      }
      if(Saturday){
         dayArr1.push(5)
         repeatArr1.push(5)
      }
      if(Sunday){
         dayArr1.push(6)
         repeatArr1.push(6)
      }

      let st_t = stEnValue.start.split(':');
      let stt = (parseInt(st_t[0])*60)+parseInt(st_t[1])

      let et_t = stEnValue.end.split(':');
      let ett = (parseInt(et_t[0])*60)+parseInt(et_t[1])

      let obj = {
         "gymId": localStorage.getItem('gymId'),
         "days": dayArr1.join(),
         "repeats": repeatArr1.join(),
         "startTime": stt,
         "endTime": ett,
         "workoutTime": duration,
         "breakTime": sanitize,
         "memberCount": members
       }

      setLoader(true)

      let url = config.appApiLink+'session/slot';
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.post( url, obj, apiHeader )
      .then( response => {
         if(response.data && response.data.status === 'success'){
            console.log(response.data)
            setLoader(false)
            window.location.reload(false)
         }else {
            console.log('error')
            setLoader(false)
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

   const getTiming = (st) => {
      var tmArr = st.split(':')
      var str = '';
      var mm = '';
      if(parseInt(tmArr[0]) > 12){
         str = parseInt(tmArr[0]) - 12
         mm = ' PM'
      }else if(parseInt(tmArr[0]) === 12){
         str = tmArr[0]
         mm = ' PM'
      }else {
         str = tmArr[0]
         mm = ' AM'
      }
      if(tmArr[1] < 10 && tmArr[1] !== '00'){
         str += ':0'+tmArr[1]+mm
      }else{
         str += ':'+tmArr[1]+mm
      }
      return str
   }

   // this is the code for delete slot
   const deleteSlot = (e, card) => {
      e.preventDefault()
      console.log(card)
      confirmAlert({
         title: 'Are you sure to do this?',
         // message: 'Are you sure to do this.',
         buttons: [
           {
             label: 'Yes',
             onClick: () => {
               setLoader(true)
               let url = config.appApiLink+'session/'+card.SlotId+'/'+card.days.join(',');
               let apiHeader = {
                  headers: {
                      'Content-Type': "application/json",
                      'accept': "application/json",
                      'Authorization': localStorage.getItem('token')
                  }
               };
               axios.delete( url, apiHeader )
               .then( response => {
                  if(response.data && response.data.status === 'success'){
                     console.log(response.data)
                     setLoader(false)
                     window.location.reload(false)
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
             label: 'No',
             onClick: () => console.log('No')
           }
         ]
       });
   }

   // this is the code for edit slot
   const [editMode, setEditMode] = useState(false)
   const [editData, setEditData] = useState('')

   const [Monday1, setMonday1] = useState(false)
   const [Tuesday1, setTuesday1] = useState(false)
   const [Wednesday1, setWednesday1] = useState(false)
   const [Thursday1, setThursday1] = useState(false)
   const [Friday1, setFriday1] = useState(false)
   const [Saturday1, setSaturday1] = useState(false)
   const [Sunday1, setSunday1] = useState(false)

   const viewSlot = (e, card) => {
      e.preventDefault()
      setEditData(card)
      setKey1Edit("")
      setKeyEdit("")
      setStartTimeEdit("")
      setEndTimeEdit("")
      setMonday1(false)
      setTuesday1(false)
      setWednesday1(false)
      setThursday1(false)
      setFriday1(false)
      setSaturday1(false)
      setSunday1(false)
      setDurationEdit("")
      setSanitizeEdit("")
      setMembersEdit("")
      setPreviewEdit(true)

      // if(parseInt(card.StartMinute)/60 > 11){
      //    setKeyEdit('PM')
      // }else{
      //    setKeyEdit('AM')
      // }
      // setStartTimeEdit(parseInt(card.StartMinute)/60)
      // if(parseInt(card.EndMinute)/60 > 11){
      //    setKey1Edit('PM')
      // }else{
      //    setKey1Edit('AM')
      // }
      // setEndTimeEdit(parseInt(card.EndMinute)/60)


      let str1 = parseInt(parseInt(card.StartMinute)/60) + ':' + (parseInt(card.StartMinute)%60 < 10 ? ('0'+parseInt(card.StartMinute)%60) : parseInt(card.StartMinute)%60);
      let str2 = parseInt(parseInt(card.EndMinute)/60) + ':' + (parseInt(card.EndMinute)%60 < 10 ? ('0'+parseInt(card.EndMinute)%60) : parseInt(card.EndMinute)%60);

      setStEnValueEdit({...stEnValueEdit, 
         start: str1,
         end: str2
      })


      setEditMode(true)
      if(card.days && card.days.length){
         card.days.forEach(function(v){
            if(days[v+1] === "Monday"){ setMonday1(true) }
            if(days[v+1] === "Tuesday"){ setTuesday1(true) }
            if(days[v+1] === "Wednesday"){ setWednesday1(true) }
            if(days[v+1] === "Thursday"){ setThursday1(true) }
            if(days[v+1] === "Friday"){ setFriday1(true) }
            if(days[v+1] === "Saturday"){ setSaturday1(true) }
            if(days[v+1] === "Sunday"){ setSunday1(true) }
         })
      }
      if(card.WorkoutDuration){
         setDurationEdit(card.WorkoutDuration)
      }
      if(card.BreakMinutes){
         setSanitizeEdit(card.BreakMinutes)
      }
      if(card.MemberCount){
         setMembersEdit(card.MemberCount)
      }
      setSlotPreviewEdit([])
   }

   const timeChangeHandlerEdit = (time) => {
      setStEnValueEdit({...stEnValue, 
         start: time.start,
         end: time.end
      })
   }

   const [stEnValueEdit, setStEnValueEdit] = useState({
      start: "01:00",
      end: "23:59"
   })

   const daysCheck1 = (e, day) => {
      e.preventDefault()
      if(day === 'Monday'){
         const Day1 = !Monday1
         setMonday1(Day1)
      }else if(day === 'Tuesday'){
         const Day2 = !Tuesday1
         setTuesday1(Day2)
      }else if(day === 'Wednesday'){
         const Day3 = !Wednesday1
         setWednesday1(Day3)
      }else if(day === 'Thursday'){
         const Day4 = !Thursday1
         setThursday1(Day4)
      }else if(day === 'Friday'){
         const Day5 = !Friday1
         setFriday1(Day5)
      }else if(day === 'Saturday'){
         const Day6 = !Saturday1
         setSaturday1(Day6)
      }else if(day === 'Sunday'){
         const Day7 = !Sunday1
         setSunday1(Day7)
      }
   }

   const closeEditModal = () => {
      setEditData('')
      setEditMode(false)
   }

   const [startTimeEdit, setStartTimeEdit] = useState("")
   const [endingTimeEdit, setEndTimeEdit] = useState("")
   const [keyEdit, setKeyEdit] = useState("AM")
   const [key1Edit, setKey1Edit] = useState("AM")

   const stTimeEdit = (e) => {
      setStartTimeEdit(e.target.value)
   }
   const stAMPMEdit = (e) => {
      setKeyEdit(e.target.value)
   }
   const edTimeEdit = (e) => {
      setEndTimeEdit(e.target.value)
   }
   const stAMPM1Edit = (e) => {
      setKey1Edit(e.target.value)
   }

   const [durationEdit, setDurationEdit] = useState("")
   const [sanitizeEdit, setSanitizeEdit] = useState("")
   const [membersEdit, setMembersEdit] = useState(0)
   const [previewEdit, setPreviewEdit] = useState(true)
   const [slotPreviewEdit, setSlotPreviewEdit] = useState([])

   const sessionSLotEdit = (e, val) => {
      if(val === 'duration'){
         setDurationEdit(e.target.value)
      }else if(val === 'sanitize'){
         setSanitizeEdit(e.target.value)
      }else if(val === 'members'){
         setMembersEdit(e.target.value)
      }
   }

   const previewEditSlot = (e) => {
      e.preventDefault()

      let dayArr = []
      let repeatArr = []

      if(!Monday1 && !Tuesday1 && !Wednesday1 && !Thursday1 && !Friday1 && !Saturday1 && !Sunday1){
         alert.show("Please select the days")
         return false
      }

      if(!membersEdit || membersEdit === 0){
         alert.show("Please add members")
         return false
      }
      
      if(Monday1){
         dayArr.push(0)
         repeatArr.push(0)
      }
      if(Tuesday1){
         dayArr.push(1)
         repeatArr.push(1)
      }
      if(Wednesday1){
         dayArr.push(2)
         repeatArr.push(2)
      }
      if(Thursday1){
         dayArr.push(3)
         repeatArr.push(3)
      }
      if(Friday1){
         dayArr.push(4)
         repeatArr.push(4)
      }
      if(Saturday1){
         dayArr.push(5)
         repeatArr.push(5)
      }
      if(Sunday1){
         dayArr.push(6)
         repeatArr.push(6)
      }

      let st_t = stEnValueEdit.start.split(':');
      let stt = (parseInt(st_t[0])*60)+parseInt(st_t[1])

      let et_t = stEnValueEdit.end.split(':');
      let ett = (parseInt(et_t[0])*60)+parseInt(et_t[1])

      setLoader(true)

      let params = "?gymId="+localStorage.getItem('gymId')+"&days="+(dayArr)+"&repeats="+(repeatArr)+"&startTime="+(stt+1)+"&endTime="+ett+"&workoutTime="+durationEdit+"&breakTime="+sanitizeEdit+"&isUpdate=true"

      let url = config.appApiLink+'session/suggestion'+params;
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
            setSlotPreviewEdit(response.data.data[0])
            setPreviewEdit(false)
            setLoader(false)
         }else{
            setLoader(false)
            console.log('here')
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );
   }

   const saveEditSlot = (e) => {
      e.preventDefault()

      let dayArr1 = []
      let repeatArr1 = []

      if(!Monday1 && !Tuesday1 && !Wednesday1 && !Thursday1 && !Friday1 && !Saturday1 && !Sunday1){
         alert.show('Please select the days')
         return false
      }

      if(!membersEdit || membersEdit === 0){
         alert.show("Please add members")
         return false
      }
      
      if(Monday1){
         dayArr1.push(0)
         repeatArr1.push(0)
      }
      if(Tuesday1){
         dayArr1.push(1)
         repeatArr1.push(1)
      }
      if(Wednesday1){
         dayArr1.push(2)
         repeatArr1.push(2)
      }
      if(Thursday1){
         dayArr1.push(3)
         repeatArr1.push(3)
      }
      if(Friday1){
         dayArr1.push(4)
         repeatArr1.push(4)
      }
      if(Saturday1){
         dayArr1.push(5)
         repeatArr1.push(5)
      }
      if(Sunday1){
         dayArr1.push(6)
         repeatArr1.push(6)
      }

      let st_t = stEnValueEdit.start.split(':');
      let stt = (parseInt(st_t[0])*60)+parseInt(st_t[1])

      let et_t = stEnValueEdit.end.split(':');
      let ett = (parseInt(et_t[0])*60)+parseInt(et_t[1])

      let obj = {
         "gymId": localStorage.getItem('gymId'),
         "days": dayArr1.join(),
         "repeats": repeatArr1.join(),
         "startTime": stt,
         "endTime": ett,
         "workoutTime": durationEdit,
         "breakTime": sanitizeEdit,
         "memberCount": membersEdit
       }

      setLoader(true)

      let url = config.appApiLink+'session/slot/'+editData.SlotId;
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.put( url, obj, apiHeader )
      .then( response => {
         if(response.data && response.data.status === 'success'){
            console.log(response.data)
            setLoader(false)
            window.location.reload(false)
         }else if(response.data && response.data.status === 'warning'){
            console.log(response.data)
            setLoader(false)
            alert.show(response.data.message)
            setTimeout(function(){
               window.location.reload(false)
            },5000)
         }else {
            console.log('error')
            setLoader(false)
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );
   }

   return (
      <>
      <Navbar name={'Slot Booking'} />
      <div className="clearfix gym-main-div">
            {loader && <Segment className="loader"></Segment>}
            {status?<div className="gym-container slot-content">
            <h3 >{slots.gym.name}</h3>
            <div className="time-display">
               <div>Open Timings</div>
               {gymTime && gymTime.length > 0 && <div className='slot-view'>
                  {gymTime.map((time, id) => (
                     <div key={"tm" + id} className="info">{getTime(time.StartTime, time.EndTime)}</div>
                  ))}
                  </div>
               }
            </div>
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
                     
                     <div className="timeline">
                        <div className="time-range">
                           <span><b>Start Time:</b> {getTiming(stEnValue.start)}</span>
                           <span><b>End Time:</b> {getTiming(stEnValue.end)}</span>
                        </div>
                        <TimeRangeSlider
                           disabled={false}
                           format={24}
                           maxValue={"23:59"}
                           minValue={"01:00"}
                           name={"time_range"}
                           onChangeStart={changeStartHandler}
                           onChangeComplete={changeCompleteHandler}
                           onChange={timeChangeHandler}
                           step={5}
                           passive={false}
                           value={stEnValue}/>
                     </div>
                     {/* <div className='timeline'>
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
                     </div> */}
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
                     <Button color='green' onClick={suggestions} className="preview-btn">
                        Preview
                     </Button>
                  </form>
               </div>:
                  <div className="add-new">
                     <Button color='green' onClick={addNewSlot} className="pull-right">
                        Add Slot
                     </Button>
                     <Button color='black' onClick={backToSlot} className="pull-left">
                        Back
                     </Button>
                  </div>
               }
               
               
               {!addSlot && slots.slots && slots.slots.length > 0 ? <div className="gym-container slot-content slot-list">
                  
                  <div className="mbr-gallery-filter container gallery-filter-active">
                     <ul buttons="0">
                     {slots.slots.map((card, i) => (
                        <li className="mbr-gallery-filter-all" key={"slot"+i}>
                           <div className={"btn btn-md btn-primary-outline display-4 " + (i=== 0 && 'first')}>
                              <div className="delete" onClick={(e) => deleteSlot(e, card)}>
                                 <Icon disabled name='delete' />
                              </div>
                              <div className="day-info" onClick={(e) => viewSlot(e, card)}>
                                 <div className="center-align">
                                    <div className="div-card-name">
                                    {card.days.map((tt, j) => (
                                       <div key={"ev"+j} className="dayname">
                                          <span>Every {days[tt+1]}</span>{(j+1)<card.days.length && ','}&nbsp;
                                       </div>
                                    ))}
                                    </div>
                                    <div>Break Time: {card.BreakMinutes} mins</div>
                                    <div>Members Allowed: {card.MemberCount}</div>
                                    <div className=" preview">
                                    {card.sessions.map((session, index) => (
                                       <div key={'st' + index} className='slot'>
                                          <span>{index+1}</span>
                                          <div className="slot-more-info">{getTime(session.StartMinute, session.EndMinute)}</div>
                                       </div>
                                    ))}
                                    {card.residue && <div className="slot" style={{whiteSpace: 'nowrap'}}>+{card.residue}</div>}
                                    </div>
                                 </div>
                                 <div className="view-slot">Click to View/Edit Slot</div>
                              </div>
                           </div>
                        </li>
                     ))}
                     </ul>
                  </div>

               </div> : !addSlot && slots.slots && slots.slots.length === 0 ? <div className="noslotyet"><span>No available slots</span></div> : null}

               <Modal open={suggestionShow} onClose={closeModal} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
                  <Modal.Header className="previewNew">Slot Preview</Modal.Header>
                  <Modal.Content image className="overhide">
                     <Modal.Description>
                     <Header>
                        <div className="repeats">
                           Repeat on 
                           <div>&nbsp;</div>
                           {Monday && <div>Every Monday</div>}
                           {Tuesday && <div>Every Tuesday</div>}
                           {Wednesday && <div>Every Wednesday</div>}
                           {Thursday && <div>Every Thursday</div>}
                           {Friday && <div>Every Friday</div>}
                           {Saturday && <div>Every Saturday</div>}
                           {Sunday && <div>Every Sunday</div>}
                        </div>
                        <br />
                        <div className="new-weight">Timing Slots: {getTiming(stEnValue.start)} - {getTiming(stEnValue.end)}</div>
                        <div className="new-weight">Break Time: <span style={{color: 'red'}}>{sanitize} mins</span></div>
                        <div className="new-weight">Members Allowed: {members}</div>
                     </Header>
                     <div className="preview">
                     {slotPreview.slots && slotPreview.slots.length > 0 && slotPreview.slots[0].sessions && slotPreview.slots[0].sessions.length > 0 && slotPreview.slots[0].sessions.map((session, index) => (
                        <div key={'session' + index} className='slot'>
                           <span>{index+1}</span>
                           {/* <span>{parseInt(session.endTime) - parseInt(session.startTime)}</span> */}
                           <div className="slot-more-info">{getTime((session.startTime-1), (session.endTime-1))}</div>
                        </div>
                     ))}
                     {slotPreview.slots && slotPreview.slots.length > 0 && slotPreview.slots[0] && <div className="slot" style={{whiteSpace: 'nowrap'}}>+{slotPreview.slots[0].residue}</div>}
                     </div>
                     </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                     <Button color='black' onClick={closeModal}>
                        Close
                     </Button>
                     <Button color='green' onClick={saveSlot}>
                        Ok
                     </Button>
                  </Modal.Actions>
               </Modal>
            
            </div>:null
            }
         </div>

         {editMode && <Modal open={editMode} onClose={closeEditModal} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
            <Modal.Header>Edit Slot</Modal.Header>
            <Modal.Content image className="overhide">
               <Modal.Description>
               <Header>
                  
               </Header>
               <div className="slot-form">
                  <form className="ui form">
                     <div className='timeline'>
                        <div className="field single-field">
                           <label htmlFor="repeat-on" style={{marginBottom: '20px'}}>Repeat On</label>
                           {daysInfo.includes('Monday')&&<div className="ui input">
                           <Checkbox label="Every Monday" checked={Monday1} onChange={(e) => daysCheck1(e, 'Monday')} /><br />
                           </div>}
                           {daysInfo.includes('Tuesday')&&<div className="ui input">
                           <Checkbox label="Every Tuesday" checked={Tuesday1} onChange={(e) => daysCheck1(e, 'Tuesday')} />
                           </div>}
                           {daysInfo.includes('Wednesday')&&<div className="ui input">
                           <Checkbox label="Every Wednesday" checked={Wednesday1} onChange={(e) => daysCheck1(e, 'Wednesday')} />
                           </div>}
                           {daysInfo.includes('Thursday')&&<div className="ui input">
                           <Checkbox label="Every Thursday" checked={Thursday1} onChange={(e) => daysCheck1(e, 'Thursday')} />
                           </div>}
                           {daysInfo.includes('Friday')&&<div className="ui input">
                           <Checkbox label="Every Friday" checked={Friday1} onChange={(e) => daysCheck1(e, 'Friday')} />
                           </div>}
                           {daysInfo.includes('Saturday')&&<div className="ui input">
                           <Checkbox label="Every Saturday" checked={Saturday1} onChange={(e) => daysCheck1(e, 'Saturday')} />
                           </div>}
                           {daysInfo.includes('Sunday')&&<div className="ui input">
                           <Checkbox label="Every Sunday" checked={Sunday1} onChange={(e) => daysCheck1(e, 'Sunday')} />
                           </div>}
                        </div>
                     </div>
                     <div className="timeline">
                        <div className="time-range">
                           <span><b>Start Time:</b> {getTiming(stEnValueEdit.start)}</span>
                           <span><b>End Time:</b> {getTiming(stEnValueEdit.end)}</span>
                        </div>
                        <TimeRangeSlider
                           disabled={false}
                           format={24}
                           maxValue={"23:59"}
                           minValue={"01:00"}
                           name={"time_range"}
                           onChange={timeChangeHandlerEdit}
                           step={5}
                           passive={false}
                           value={stEnValueEdit}/>
                     </div>
                     {/* <div className='timeline'>
                        <div className="field">
                           <label htmlFor="start-time1">Start TIme</label>
                           <div className="ui input">
                           <select id="start-time1" value={startTimeEdit} onChange={stTimeEdit}>
                              {timings.map((option, id) => (
                                 <option key={"tt" + id} value={option.hour}>{option.name}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="start">AM/PM</label>
                           <div className="ui input">
                           <select id="start" value={keyEdit} onChange={stAMPMEdit}>
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
                           <select id="end-time" value={endingTimeEdit} onChange={edTimeEdit}>
                              {timings.map((option, id) => (
                                 <option key={"tt" + id} value={option.hour}>{option.name}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="end">AM/PM</label>
                           <div className="ui input">
                           <select id="end" value={key1Edit} onChange={stAMPM1Edit}>
                              <option value='AM'>AM</option>
                              <option value='PM'>PM</option>
                           </select>
                           </div>
                        </div>
                     </div> */}
                     <div className='timeline'>
                        <div className="field single-field">
                           <label htmlFor="Duration">Workout Duration</label>
                           <div className="ui input">
                           <select id="Duration" value={durationEdit} onChange={(e) => sessionSLotEdit(e, 'duration')}>
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
                           <select id="sanitize" value={sanitizeEdit} onChange={(e) => sessionSLotEdit(e, 'sanitize')}>
                              {sanitizeValues.map((option, id) => (
                                 <option key={"sa" + id} value={option}>{option}</option>
                              ))}
                           </select>
                           </div>
                        </div>
                        <div className="field">
                           <label htmlFor="members">Members Allowed</label>
                           <div className="ui input">
                              <input id="members" value={membersEdit} onChange={(e) => sessionSLotEdit(e, 'members')} />
                           </div>
                        </div>
                     </div>
                  </form>
                  <div className="new">
                     <div className="preview">
                     {slotPreviewEdit.slots && slotPreviewEdit.slots.length > 0 && slotPreviewEdit.slots[0].sessions && slotPreviewEdit.slots[0].sessions.length > 0 && slotPreviewEdit.slots[0].sessions.map((session, index) => (
                        <div key={'session' + index} className='slot'>
                           <span>{index+1}</span>
                           <div className="slot-more-info">{getTime((session.startTime-1), (session.endTime-1))}</div>
                        </div>
                     ))}
                     {slotPreviewEdit.slots && slotPreviewEdit.slots.length > 0 && slotPreviewEdit.slots[0] && <div className="slot" style={{whiteSpace: 'nowrap'}}>+{slotPreviewEdit.slots[0].residue}</div>}
                     </div>
                  </div>
               </div>
               </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
               <Button color='black' onClick={closeEditModal}>
                  Close
               </Button>
               {previewEdit && <Button color='green' onClick={previewEditSlot}>
                  Preview
               </Button>}
               {slotPreviewEdit.slots && slotPreviewEdit.slots.length > 0 && slotPreviewEdit.slots[0].sessions && slotPreviewEdit.slots[0].sessions.length > 0 && <Button color='green' onClick={saveEditSlot}>
                  Ok
               </Button>
               }
            </Modal.Actions>
         </Modal>}
      </>
   )
}

export default Slotbooking