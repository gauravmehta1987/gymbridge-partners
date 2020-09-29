import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import config from '../../config'
import axios from 'axios'
import { Segment, Modal, Button, Header, Image, Table } from 'semantic-ui-react'
import DatePicker from 'react-date-picker'
import { addDays } from 'date-fns'
import './Workout.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

function WorkoutStats(){

   const [startDate, setStartDate] = useState(new Date())
   const [loader, setLoader] = useState(false)
   const alert = useAlert()

   const [members, setMembers] = useState([])

   const showMembers = (id) => {
      setLoader(true)
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
      
      let url = config.appApiLink+'exercise/getworkoutstatsmembers?date='+dateStr+'&endTime='+chartData[id].en+'&startTime='+chartData[id].st
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
            setLoader(false)
            let list = []
            response.data.data.forEach((v) => {
               list.push(v)
            })
            setMembers(list)
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

   const [chartData, setChartData] = useState([])

   let chartConfigs = {
      type: "column2d", // The chart type
      width: "400", // Width of the chart
      height: "400", // Height of the chart
      dataFormat: "json", // Data type
      dataSource: {
        // Chart Configuration
        chart: {
          //Set the chart caption
          caption: "TImings v/s Users",
          //Set the chart subcaption
          subCaption: "",
          //Set the x-axis name
          xAxisName: "TImings",
          //Set the y-axis name
          yAxisName: "Users",
          numberSuffix: "",
          //Set the theme for your chart
          theme: "fusion"
        },
        // Chart Data
        data: chartData
      },
      events: {
         dataPlotClick: function(e) {
            console.log(e.data)
            if(e.data.dataValue){
               showMembers(e.data.dataIndex)
            }
         }
       }
    }

   useEffect(() => {
      console.log(chartData)
      chartConfigs.dataSource.data = chartData
   }, [chartData])


   const set_StartDate = (date) => {
      setStartDate(date)
   }

   const fetchWorkoutDetails = () => {
      setLoader(true)
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
      
      let url = config.appApiLink+'exercise/getworkoutstats?date='+dateStr
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
            setLoader(false)
            let list = []
            response.data.data.forEach((v) => {
               list.push({
                  label: v.startTime+'-'+v.endTime,
                  value: v.count,
                  st: v.startTime,
                  en: v.endTime
               })
            })
            setChartData(list)
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

   useEffect(() => {
      fetchWorkoutDetails()
   }, [startDate])

   return (
      <>
         <Navbar name={'Slot Stats'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="workout-container">
            <div className="calender">
               <span className="inline">
                  <DatePicker
                     value={startDate}
                     onChange={set_StartDate}
                     maxDate={addDays(new Date(), 1)}
                     placeholderText="Select a date"
                     className="datepicker"
                     format='d-MM-y'
                     autoFocus={false}
                     clearIcon={null}
                  />
               </span>
            </div>
            <div className="chart-area">
            <ReactFC {...chartConfigs} />
            </div>
            {members.length > 0 && 
            <div className="table-area">
               <h3>Member's Section</h3>
               <table>
                  <tr>
                     <th>Name</th>
                     <th>Id</th>
                  </tr>
                  {members.map((user, i) => (
                     <tr key={'user'+i}>
                        <td>{user.name}</td>
                        <td>{user.userId}</td>
                     </tr>
                  ))}
               </table>
            </div>}
         </div>
      </>
   )
}

export default WorkoutStats