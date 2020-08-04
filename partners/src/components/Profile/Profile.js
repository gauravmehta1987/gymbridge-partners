import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Button, Header, Modal, Checkbox, Loader, Segment } from 'semantic-ui-react'
import './Profile.css'
import config from '../../config';
import axios from 'axios'
import { useAlert } from 'react-alert'

function Profile(){

   const alert = useAlert()

   const [title, setTitle] = useState('')
   const [loader, setLoader] = useState(false)

   const [open, setOpen] = useState(false)

   const close = () => {
      setOpen(false);
   }

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

   const [gymInfo, setGymInfo] = useState('');
   const [timeSlots, setTimeSlots] = useState('');

   const [timeSlotsData1, setTimeSlotsData1] = useState([]);
   const [timeSlotsData2, setTimeSlotsData2] = useState([]);
   const [timeSlotsData3, setTimeSlotsData3] = useState([]);
   const [timeSlotsData4, setTimeSlotsData4] = useState([]);
   const [timeSlotsData5, setTimeSlotsData5] = useState([]);
   const [timeSlotsData6, setTimeSlotsData6] = useState([]);
   const [timeSlotsData7, setTimeSlotsData7] = useState([]);

   const fetchGymData = () => {
      setGymInfo('');
      setLoader(true)
      let st1 = [];
      let st2 = [];
      let st3 = [];
      let st4 = [];
      let st5 = [];
      let st6 = [];
      let st7 = [];
      let url = config.apiLink+'/onboarding/gym?id=8';
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
            setGymInfo(response.data.data[0])
            setLoader(false)

            if (response.data.data[0].timeSlots && response.data.data[0].timeSlots.length) {
               setTimeSlots(response.data.data[0].timeSlots)
               response.data.data[0].timeSlots.forEach(function(v, i){

                  var key = '';
                  var hour1 = '';
                  var key2 = '';
                  var hour2 = '';
                  var hour = '';
                  if (v.StartTime) {
                     hour = parseInt(v.StartTime)/60;
                     if (hour > 12) {
                           key = 'PM';
                           hour1 = hour-12;
                     }else if (hour === 12) {
                           key = 'PM';
                           hour1 = 12;
                     }else{
                           key = 'AM';
                           hour1 = hour;
                     }
                  }
                  if (v.EndTime) {
                     hour = parseInt(v.EndTime)/60;
                     if (hour > 12) {
                           key2 = 'PM';
                           hour2 = hour-12;
                     }else if (hour === 12) {
                           key2 = 'PM';
                           hour2 = 12;
                     }else{
                           key2 = 'AM';
                           hour2 = hour;
                     }
                  }

                  if (v.Day === 1) {
                     st2.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }else if (v.Day === 2) {
                     st3.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }else if (v.Day === 3) {
                     st4.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }else if (v.Day === 4) {
                     st5.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }else if (v.Day === 5) {
                     st6.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }else if (v.Day === 6) {
                     st7.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }else if (v.Day === 0) {
                     st1.push({'key': key, 'hour': hour1, 'key2': key2, 'hour2': hour2});
                  }
                  
               });
            }

            setTimeSlotsData1(st1)
            setTimeSlotsData2(st2)
            setTimeSlotsData3(st3)
            setTimeSlotsData4(st4)
            setTimeSlotsData5(st5)
            setTimeSlotsData6(st6)
            setTimeSlotsData7(st7)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      } );      
    };

   useEffect(() => {
      fetchGymData();
    },[]);

   const [data, setData] = useState([])
   const [input, setInput] = useState('')

   useEffect(() => {
      // console.log(data)
    },[data]);

   const viewModal = (view) => {
      setTitle(view)
      setOpen(true)
      setInput(view)
      setCB(false)
      if(view === 'Monday'){
         setData(timeSlotsData1)
      }else if(view === 'Tuesday'){
         setData(timeSlotsData2)
      }else if(view === 'Wednesday'){
         setData(timeSlotsData3)
      }else if(view === 'Thursday'){
         setData(timeSlotsData4)
      }else if(view === 'Friday'){
         setData(timeSlotsData5)
      }else if(view === 'Saturday'){
         setData(timeSlotsData6)
      }else if(view === 'Sunday'){
         setData(timeSlotsData7)
      }
   }

   const add_more_data = (e) => {
      e.preventDefault();
      setData([...data, {'key': 'AM', 'hour': 1, 'key2': 'AM', 'hour2': 1}])
   }

   const deleteentrydocs = (e, docindex) => {
      e.preventDefault();
      const st = [];
      data.forEach(function(v, i){
         if(i !== docindex){
            st.push(v)
         }
      })
      setData(st)
   }

   const save = () => {
      let id = 0;
      if(input === 'Monday'){
         id = 0
      }else if(input === 'Tuesday'){
         id = 1
      }else if(input === 'Wednesday'){
         id = 2
      }else if(input === 'Thursday'){
         id = 3
      }else if(input === 'Friday'){
         id = 4
      }else if(input === 'Saturday'){
         id = 5
      }else if(input === 'Sunday'){
         id = 6
      }

      const newGym = gymInfo;

      newGym.address = gymInfo.Address;
      newGym.latLong = gymInfo.LatLong;
      newGym.memberCount = gymInfo.MemberCount;
      newGym.ownerNumber = gymInfo.OwnerNumber;
      newGym.ownerName = gymInfo.OwnerName;
      newGym.ownerAccountId = gymInfo.OwnerAccountId;
      newGym.ownerImageId = gymInfo.OwnerImageId;
      newGym.name = gymInfo.Name;
      newGym.id = gymInfo.Id;
      newGym.timeSlots = [];

      if(timeSlots && timeSlots.length){
         timeSlots.forEach(function(v, i){
            if(v.Day !== id){
               newGym.timeSlots.push({startTime: v.StartTime, endTime: v.EndTime, day: v.Day})
            }
         })
      }

      if(newGym.packages && newGym.packages.length){
         delete newGym.packages
      }

      if(!cb){
         data.forEach(function(v, j){
            var startTime = 0;
            var endTime = 0;
            if(v.hour && v.key){
                  if (v.key === "AM") {
                     startTime = parseInt(v.hour)*60;
                  }else if (v.key === "PM") {
                     startTime = (parseInt(v.hour)+12)*60;
                  }
            }
            if(v.hour2 && v.key2){
                  if (v.key2 === "AM") {
                     endTime = parseInt(v.hour2)*60;
                  }else if (v.key2 === "PM") {
                     endTime = (parseInt(v.hour2)+12)*60;
                  }
            }
            
            newGym.timeSlots.push({
                  startTime: startTime,
                  endTime: endTime,
                  day: id,
            })
         })
      }
      setLoader(true)

      let url = config.apiLink+'/onboarding/gym';
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.put( url, newGym, apiHeader )
      .then( response => {
         if(response.data && response.data.status === 'success'){
            // console.log(response.data)
            // setGymInfo(newGym)
            // setTimeSlots(newGym.timeSlots)
            window.location.reload(false)
            setLoader(false)
         }else{
            console.log('error')
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      // window.location.reload(false)
      } );

   }

   const stTime = (e, k, id) => {
      e.preventDefault();
      const stt1 = [];
      data.forEach(function(v, i){
         if(i === id){
            v[k] = e.target.value
            stt1.push(v)
         }else{
            stt1.push(v)
         }
      })
      setData(stt1)
   }
   const stAMPM = (e, k, id) => {
      e.preventDefault();
      const stt1 = [];
      data.forEach(function(v, i){
         if(i === id){
            v[k] = e.target.value
            stt1.push(v)
         }else{
            stt1.push(v)
         }
      })
      setData(stt1)
   }
   const edTime = (e, k, id) => {
      e.preventDefault();
      const stt1 = [];
      data.forEach(function(v, i){
         if(i === id){
            v[k] = e.target.value
            stt1.push(v)
         }else{
            stt1.push(v)
         }
      })
      setData(stt1)
   }
   const edAMPM = (e, k, id) => {
      e.preventDefault();
      const stt1 = [];
      data.forEach(function(v, i){
         if(i === id){
            v[k] = e.target.value
            stt1.push(v)
         }else{
            stt1.push(v)
         }
      })
      setData(stt1)
   }

   const [cb, setCB] = useState(false)

   const offCheck = (e) => {
      e.preventDefault()
      const cb1 = !cb;
      setCB(cb1)
   }

   return (
      <>
      <Navbar name={'Profile'} />
      {loader && <Segment className="loader"></Segment>}
         <div className="clearfix gym-main-div">
            {gymInfo?<div className="gym-container">
               <h3>{gymInfo.Name}</h3>
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                     <li className="mbr-gallery-filter-all">
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData1.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Monday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Monday
                                 <div className="more-info">
                                 {timeSlotsData1.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     <li>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData2.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Tuesday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Tuesday
                                 <div className="more-info">
                                 {timeSlotsData2.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     <li>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData3.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Wednesday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Wednesday
                                 <div className="more-info">
                                 {timeSlotsData3.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     <li>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData4.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Thursday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Thursday
                                 <div className="more-info">
                                 {timeSlotsData4.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     <li>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData5.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Friday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Friday
                                 <div className="more-info">
                                 {timeSlotsData5.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     <li>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData6.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Saturday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Saturday
                                 <div className="more-info">
                                 {timeSlotsData6.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     <li>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (timeSlotsData7.length === 0 ? 'not' : 'yes')} onClick={() => viewModal('Sunday')}>
                           <div className="day-info">
                              <div className="center-align">
                                 Sunday
                                 <div className="more-info">
                                 {timeSlotsData7.map((tt, i) => (
                                    <div key={"mon"+i} className="">
                                       {(i<2)&&<span>{tt.hour} {tt.key} - {tt.hour2} {tt.key2}</span>}
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                  </ul>
               </div>

               <Modal open={open} onClose={close} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
                  <Modal.Header>{title}<span style={{float: 'right'}}><Checkbox label='OFF' checked={cb} onChange={offCheck} /></span></Modal.Header>
                  <Modal.Content image>
                     <Modal.Description>
                     <Header>Timing Slots</Header>
                     <form className="ui form">
                     {data && data.length > 0 && data.map((dd, index) => (
                        <div key={'time' + index} className='timeline'>
                           
                           <div className="field">
                              <label htmlFor={"start-time"+index}>Start TIme</label>
                              <div className="ui input">
                              <select id={"start-time"+index} disabled={cb} value={data[index].hour} onChange={(e) => stTime(e, 'hour', index)}>
                                 {timings.map((option, id) => (
                                    <option key={"tt" + id} value={option.hour}>{option.name}</option>
                                 ))}
                              </select>
                              </div>
                           </div>
                           <div className="field">
                              <label htmlFor={"start-"+index}>AM/PM</label>
                              <div className="ui input">
                              <select id={"start-"+index} disabled={cb} value={data[index].key} onChange={(e) => stAMPM(e, 'key', index)}>
                                 <option value="" disabled>AM/PM</option>
                                 <option value='AM'>AM</option>
                                 <option value='PM'>PM</option>
                              </select>
                              </div>
                           </div>

                           <div className="field">
                              <label htmlFor={"end-time"+index}>End TIme</label>
                              <div className="ui input">
                              <select id={"end-time"+index} disabled={cb} value={data[index].hour2} onChange={(e) => edTime(e, 'hour2', index)}>
                                 {timings.map((option, id) => (
                                    <option key={"tt" + id} value={option.hour}>{option.name}</option>
                                 ))}
                              </select>
                              </div>
                           </div>
                           <div className="field">
                              <label htmlFor={"end-"+index}>AM/PM</label>
                              <div className="ui input">
                              <select id={"end-"+index} disabled={cb} value={data[index].key2} onChange={(e) => edAMPM(e, 'key2', index)}>
                                 <option value="" disabled>AM/PM</option>
                                 <option value='AM'>AM</option>
                                 <option value='PM'>PM</option>
                              </select>
                              </div>
                           </div>

                           {index > 0 && !cb && <div className="delete_doc_opt"><button className="ui button" onClick={(e) => deleteentrydocs(e, index)}>Delete Slot</button></div>}
                           
                        </div>
                     ))}
                     {!cb?<div className="addmore"><button className="ui button" onClick={add_more_data}>Add Slot</button></div>:null}
                     </form>
                     </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                     <Button color='black' onClick={close}>
                        Close
                     </Button>
                     <Button color='green' onClick={save}>
                        Save
                     </Button>
                  </Modal.Actions>
               </Modal>

            </div>:
            null}
         </div>
      </>
   )
}

export default Profile