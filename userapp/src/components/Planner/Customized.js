import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment, Button } from 'semantic-ui-react'
import config from '../../config'
import axios from 'axios'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import DatePicker from 'react-date-picker'
import { addDays } from 'date-fns'
import '../Dashboard/Dashboard.css'
import './Planner.css'
import { useHistory } from 'react-router'

function Customized(){
   
   const [loader, setLoader] = useState(false)
   const [showSection, setShowSection] = useState(false)
   const alert = useAlert()
   const history = useHistory()

   const timings = [
      {"name": "1:00","hour": 1},
      {"name": "1:30","hour": 1.5},
      {"name": "2:00","hour": 2},
      {"name": "2:30","hour": 2.5},
      {"name": "3:00","hour": 3},
      {"name": "3:30","hour": 3.5},
      {"name": "4:00","hour": 4},
      {"name": "4:30","hour": 4.5},
      {"name": "5:00","hour": 5},
      {"name": "5:30","hour": 5.5},
      {"name": "6:00","hour": 6},
      {"name": "6:30","hour": 6.5},
      {"name": "7:00","hour": 7},
      {"name": "7:30","hour": 7.5},
      {"name": "8:00","hour": 8},
      {"name": "8:30","hour": 8.5},
      {"name": "9:00","hour": 9},
      {"name": "9:30","hour": 9.5},
      {"name": "10:00","hour": 10},
      {"name": "10:30","hour": 10.5},
      {"name": "11:00","hour": 11},
      {"name": "11:30","hour": 11.5},
      {"name": "12:00","hour": 12}
   ];

   const [startDate, setStartDate] = useState(new Date())

   const [exercisetype, setExercisetype] = useState([])
   const [stTiming, setStTiming] = useState(1)
   const [stKey, setStKey] = useState('AM')

   const fetchCategory = () => {
      setLoader(true)
      let url = config.appApiLink + 'exercise/getexercisetype'
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
            if(response.data.data){
               setExercisetype(response.data.data)
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
      fetchCategory()
    },[]);

   const set_StartDate = (date) => {
      setStartDate(date)
   }


   return (
      <>
         <Navbar name={'Customized Workout'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="container dashboard">
            <form className="ui form">
               <div className={"main-sections " + (showSection? 'none' : 'block')}>
                  <div className="calender field">
                     <label>Date</label>
                     <DatePicker
                        value={startDate}
                        onChange={set_StartDate}
                        minDate={addDays(new Date(), 0)}
                        placeholderText="Select a date"
                        className="datepicker"
                        format='d-MM-y'
                        autoFocus={false}
                        clearIcon={null}
                     />
                  </div>
                  <div className="field two-row">
                     <label htmlFor="start-time">Start TIme</label>
                     <div className="ui input">
                     <select id="start-time" value={stTiming} onChange={(e) => setStTiming(e.target.value)}>
                        {timings.map((option, id) => (
                           <option key={"tt" + id} value={option.hour}>{option.name}</option>
                        ))}
                     </select>
                     </div>
                  </div>
                  <div className="field two-row">
                     <label htmlFor="start-info">AM/PM</label>
                     <div className="ui input">
                     <select id="start-info" value={stKey} onChange={(e) => setStKey(e.target.value)}>
                        <option value="" disabled>AM/PM</option>
                        <option value='AM'>AM</option>
                        <option value='PM'>PM</option>
                     </select>
                     </div>
                  </div>
                  <Button type="button" color='black' onClick={(e) => setShowSection(true)}>
                     Continue
                  </Button>
               </div>

               <div className={"main-sections " + (showSection? 'block' : 'none')}>
                  <div className="goback">
                     <Button type="button" color='black' onClick={(e) => setShowSection(false)} className="pull-left">
                        Back
                     </Button>
                  </div>
                  <div className="field">
                     <label htmlFor="exercisetype">Exercise Type</label>
                     <div className="ui input" style={{display: 'block'}}>
                     {exercisetype.map((option, id) => (
                     <div className="cat-list" key={"exercisetype" + id}>
                        <label>
                           <input type="radio" name="category" className="card-input-element" />
                           {/* checked={option.Name === selectedCat} value={option.Name} onChange={selectedExercisetype} */}
                              <div className="panel panel-default card-input">
                                 <div className="panel-body">
                                 {option.Name}
                                 </div>
                              </div>
                        </label>
                     </div>
                     ))}
                     </div>
                  </div>
               </div>

            </form>
         </div>
      </>
   )
}

export default Customized