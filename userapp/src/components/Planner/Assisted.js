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

function Assisted(){
   
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

  const durationValues = [{
   value: '45',
   display: '0:45 Hours'
   },{
      value: '60',
      display: '1 Hour'
   },{
      value: '75',
      display: '1:15 Hours'
   },{
      value: '90',
      display: '1.30 Hours'
   }]

   const [category, setCategory] = useState([])
   const [musclesList, setMusclesList] = useState([])
   const [exeList, setExeList] = useState([])
   const [startDate, setStartDate] = useState(new Date())

   const [selectedCat, setSelectedCat] = useState('')
   const [selectedMus, setSelectedMus] = useState('')
   const [selectedExe, setSelectedExe] = useState('')
   const [catId, setCatId] = useState(0)
   const [stTiming, setStTiming] = useState(1)
   const [stKey, setStKey] = useState('AM')
   const [duration, setDuration] = useState(durationValues[0].value)

   const fetchCategory = () => {
      setLoader(true)
      let url = config.appApiLink + 'exercise/getcategories'
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
               setCategory(response.data.data)
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

   const getMuscles = (id) => {
      setLoader(true)
      let url = config.appApiLink + 'exercise/getcategorymuscles?id=' + id
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
                  let tempName = ''
                  if(v.muscleList && v.muscleList.length){
                     v.muscleList.forEach((j) => {
                        if(j.muscle && j.muscle.Name){
                           tempName += j.muscle.Name + '-'
                        }
                     })
                  }
                  v.tempName = tempName.substring(0, tempName.length - 1)
               })
               setMusclesList(response.data.data)
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

   const getExercise = (id) => {
      setLoader(true)
      let url = config.appApiLink + 'exercise/getassistedworkout?time=' + duration + '&combinationid=' + id
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
                  let tempName = ''
                  if(v.ExerciseList && v.ExerciseList.length){
                     v.ExerciseList.forEach((j) => {
                        if(j.Exercise && j.Exercise.Name){
                           tempName += j.Exercise.Name + '\n'
                        }
                     })
                  }
                  v.tempName = tempName
               })
               setExeList(response.data.data)
               setSelectedExe(response.data.data[0].Id)
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

   useEffect(()=>{
      let id = category.findIndex((v) => v.Name === selectedCat)
      if(id >= 0){
         getMuscles(category[id].Id)
      }
   }, [selectedCat])

   useEffect(()=>{
      if(selectedMus){
         getExercise(selectedMus)
      }
   }, [selectedMus])

   const selectedCategory = (e) => {
      e.preventDefault()
      setSelectedMus('')
      setSelectedExe('')
      setExeList([])
      setSelectedCat(e.target.value)
   }

   const selectedExercise = (e, id) => {
      e.preventDefault()
      setSelectedExe('')
      setCatId(id)
      setSelectedExe(parseInt(e.target.value))
   }

   const saveAssisted = (e) => {
      e.preventDefault()

      let obj = {
         assistedWorkoutId: selectedExe,
         date: 0,
         time: 0
      }

      let hours = 0
      if(stKey === 'AM'){
         hours = parseInt(stTiming)*60
      }else{
         hours = (parseInt(stTiming)+12)*60
      }
      obj.time = hours

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

      console.log(obj)

      setLoader(true)
      let url = config.appApiLink+'exercise/addassistedworkout'
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

   const timeConvert = (n) => {
      var d = Number(n);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m === 1 ? " min, " : " mins, ") : "";
      var sDisplay = s > 0 ? s + (s === 1 ? " sec" : " secs") : "";
      return hDisplay + mDisplay + sDisplay;
   }

   return (
      <>
         <Navbar name={'Assisted Workout'} />
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
                  <div className="field single-field">
                     <label htmlFor="Duration">Duration</label>
                     <div className="ui input">
                     <select id="Duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                        {durationValues.map((option, id) => (
                           <option key={"du" + id} value={option.value}>{option.display}</option>
                        ))}
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
                     <label htmlFor="Category">Category</label>
                     <div className="ui input" style={{display: 'block'}}>
                     {category.map((option, id) => (
                     <div className="cat-list" key={"category" + id}>
                        <label>
                           <input type="radio" name="category" className="card-input-element" checked={option.Name === selectedCat} value={option.Name} onChange={selectedCategory} />
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
                  <div className="field">
                     <label htmlFor="Category">Muscles</label>
                     <div className="ui input">
                        <select id="Category" value={selectedMus} onChange={(e) => setSelectedMus(e.target.value)}>
                           <option value="" disabled>Select</option>
                           {musclesList.map((option, id) => (
                              <option key={"musclesList" + id} value={option.Id}>
                                 {option.tempName}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>
                  {exeList.length > 0 && 
                  <>
                  <div className="field">
                     <label htmlFor="Exercise">Exercise</label>
                     <div className="ui input" style={{display: 'block'}}>
                     {exeList.map((option, id) => (
                     <div className={"cat-list " + (option.Id === selectedExe ? 'selected': '')} key={"exeList" + id}>
                        <label>
                           <input type="radio" name="exeList" className="card-input-element"  value={option.Id} onChange={(e) => selectedExercise(e, id)} />
                              <div className="panel panel-default card-input">
                                 <div className="panel-body">
                                 Select Category: {id+1}
                                 </div>
                              </div>
                              {/* {exeList.length > 0 && <div className="cc"> Select Category: {id+1}</div>} */}
                        </label>
                     </div>
                     ))}
                     </div>
                  </div>
                  <div className="field">
                     <div className="ui input card-layout">
                     {exeList.map((option, id) => (
                     <div className={"cat-list all-lists " + (id === catId ? 'showing': 'hiding')} id={"calculate-width-"+id} key={"exeList" + id}>
                        <div className="panel panel-default card-input">
                           <div className="panel-body">
                           <div className="cat-name">Category: {id+1}</div>
                           {option.ExerciseList.map((ex, i) => (
                              <div key={"ex" + i} className="newcards">
                                 <div className="img" style={{backgroundImage: 'url(sample.png)'}}>
                                 </div>
                                 <div className="text">
                                    <div className="counts set">{ex.Set}<br />Set</div>
                                    <div className="counts rep">{ex.Rep}<br />Rep</div>
                                    <div className="counts">Max Duration: {timeConvert(parseInt(ex.Time))}</div>
                                    <div className="counts name">{ex.Exercise.Name}</div>
                                 </div>
                              </div>
                           ))}
                           </div>
                        </div>
                     </div>
                     ))}
                     </div>
                  </div>
                  </>
                  }

                  {selectedExe && selectedMus && <Button type="button" color='black' onClick={saveAssisted} className="pull-left fixedButton">
                     Save
                  </Button>}
               </div>
               
            </form>
         </div>
      </>
   )
}

export default Assisted