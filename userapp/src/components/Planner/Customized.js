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
import { Checkbox } from 'semantic-ui-react'

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
   const [muscleList, setMuscleList] = useState([])
   const [exerciseList, setExerciseList] = useState([])
   const [stTiming, setStTiming] = useState(1)
   const [stKey, setStKey] = useState('AM')
   const [selectedExercise, setSelectedExercise] = useState([])

   const [selectedType, setSelectedType] = useState('')
   const [selectedMus, setSelectedMus] = useState('')

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
               setSelectedType(response.data.data[0].Name)
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

   const fetchMuscles = (e) => {
      if(selectedType === ''){
         return false
      }
      setLoader(true)
      let url = config.appApiLink + 'exercise/getweighttrainingmuscles'
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
               setMuscleList(response.data.data)
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

   const fetchExercises = (musid) => {
      setLoader(true)
      if(selectedType === ''){
         return false
      }
      if(selectedType === 'Weight Training' && musid === '' && selectedMus === ''){
         return false
      }
      let typeId = exercisetype.findIndex((v) => v.Name === selectedType)
      let url = config.appApiLink + 'exercise/getavailableexercise?id=' + exercisetype[typeId].Id
      if(musid !== ''){
         url += '&muscleId=' + musid
      }else if(selectedMus !== '') {
         url += '&muscleId=' + selectedMus
      }
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
               response.data.data.forEach((v) => {
                  v.selected = false
                  v.selectedId = ''
               })
               setExerciseList(response.data.data)
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
      if(showSection){
         setExerciseList([])
         if(selectedType === 'Weight Training'){
            fetchMuscles()
         }else {
            setMuscleList([])
         }
         setSelectedExercise([])
         fetchExercises('')
      }
    },[selectedType, showSection]);

   useEffect(() => {
      if(showSection){
         setExerciseList([])
         setSelectedExercise([])
         fetchExercises(selectedMus)
      }
    },[selectedMus, showSection]);

   const handleVideoChange = (id, obj) => {
      const values = [...exerciseList]
      values[id].selected = !values[id].selected
      const list = [...selectedExercise]
      let idx = list.findIndex((v) => v.Id === obj.Id)
      if(idx >= 0){
         list.splice(idx, 1)
      }else{
         list.push(obj)
      }
      setSelectedExercise(list)
      setExerciseList(values)
   }

   const checkCount = (id) => {
      let num = selectedExercise.findIndex((v) => v.Id === id)
      if(num >= 0){
         return (num+1)
      }else {
         return ''
      }
   }

   const saveCustomized = (e) => {
      e.preventDefault()

      let obj = {
         exerciseIds: [],
         date: 0,
         time: 0
      }

      // calculate time
      let hours = 0
      if(stKey === 'AM'){
         hours = parseInt(stTiming)*60
      }else{
         hours = (parseInt(stTiming)+12)*60
      }
      obj.time = hours

      // calculate date
      let dd = new Date(startDate)
      let dateStr = dd.getFullYear()
      let mm = dd.getMonth() + 1
      let ddd = dd.getDate()
      if(mm < 10){
         dateStr += '0'+mm
      }else{
         dateStr += ''+mm
      }
      if(ddd < 10){
         dateStr += '0'+ddd
      }else{
         dateStr += ''+ddd
      }
      obj.date = dateStr

      // add exercise ids
      if(selectedExercise && selectedExercise.length){
         selectedExercise.forEach((v) => {
            obj.exerciseIds.push(v.Id)
         })
      }

      console.log(obj)

      setLoader(true)
      let url = config.appApiLink+'exercise/addcustomworkout'
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
            // console.log(response.data)
            setLoader(false)
            alert.show(response.data.message)
            setTimeout(function(){
               history.push({
                  pathname: '/'
               })
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
   
   return (
      <>
         <Navbar name={'Plan Your Workout'} />
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
                           <input type="radio" name="category" className="card-input-element" checked={option.Name === selectedType} value={option.Name} onChange={(e) => setSelectedType(e.target.value)} />
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

                  {muscleList.length > 0 && <div className="field">
                     <label htmlFor="Category">Muscles</label>
                     <div className="ui input">
                        <select id="Category" value={selectedMus} onChange={(e) => setSelectedMus(e.target.value)}>
                           <option value="" disabled>Select</option>
                           {muscleList.map((option, id) => (
                              <option key={"muscleList" + id} value={option.Id}>
                                 {option.Name}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>}

                  {exerciseList.length > 0 && <div className="field">
                     <div className="ui input card-layout">
                     {exerciseList.map((option, id) => (
                     <div className="cat-list all-lists showing text-align" key={"exeList" + id}>
                        <div className="panel panel-default card-input">
                           <div className="panel-body">
                           <div className="cat-name">Category: {id+1}</div>
                           <div className="newcards">
                              <div className="img" style={{backgroundImage: 'url(sample.png)'}}>
                              </div>
                              <div className="text">
                                 <div className="counts name">{option.Name}</div>
                                 <div className="custom-check-box">
                                    <label>
                                       {/* Select: {option.selectedId}: =={option.selected ? 'true':'false'}== */}
                                       <Checkbox
                                          checked={option.selected}
                                          label={'Select ' + checkCount(option.Id)}
                                          onChange={() =>
                                             handleVideoChange(
                                                id,
                                                option
                                             )
                                          }
                                          />
                                    </label>
                                 </div>
                              </div>
                           </div>
                           </div>
                        </div>
                     </div>
                     ))}
                     </div>
                  </div>}

                  {selectedExercise.length > 0 && <Button type="button" color='black' onClick={saveCustomized} className="pull-left fixedButton">
                     Save
                  </Button>}

               </div>
            </form>
         </div>
      </>
   )
}

export default Customized