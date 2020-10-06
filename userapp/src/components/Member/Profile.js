import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import './Member.css'
import config from '../../config'
import axios from 'axios'

function ViewMember(){

   const [loader, setLoader] = useState(false)
   const alert = useAlert()

   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [phone, setPhone] = useState('')
   const [gymname, setGymname] = useState('')
   const [img, setImg] = useState('')

   const [currentPackage, setCurrentPackage] = useState({amount: '', duedate: '', tenure: ''})
   const [packageHistory, setPackageHistory] = useState([])
   const [workOutHistory, setWorkOutHistory] = useState([])

   const fetchMyInfo = () => {
      setLoader(true)
      let url = config.appApiLink + 'member/getprofile'
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.get( url, apiHeader )
      .then( response => {
         // setLoader(false)
         console.log(response.data)
         if(response.data && response.data.status === 'success'){
            setName(response.data.data.name)
            setEmail(response.data.data.email)
            setPhone(response.data.data.mobileNumber)
            setGymname(response.data.data.gym.Name)
            setImg(response.data.data.photo)

            if(response.data.data.subscriptions && response.data.data.subscriptions.length){
               if(response.data.data.subscriptions[0].paymentStatus === "PAYMENT PENDING"){
                  setCurrentPackage({...currentPackage, amount: response.data.data.subscriptions[0].amount, duedate: response.data.data.subscriptions[0].paymentDueDate, tenure: response.data.data.subscriptions[0].tenure})
               }
               let pack = []
               response.data.data.subscriptions.forEach((v, i) => {
                  if(i > 0){
                     pack.push(v)
                  }
               })
               setPackageHistory(pack)
            }
            fetchWorkoutHistory(response.data.data.id)
         }else {
            console.log('error')
            setLoader(false)
            alert.show(response.data.message)
         }
      })
      .catch( error => {
      console.log(error);
      setLoader(false)
      alert.show("API gives an error, please login again")
      } );
   }

   const fetchWorkoutHistory = id => {
      //get current date
      let dd = new Date()
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

      var d = new Date();
      // Set it to one month ago
      d.setMonth(d.getMonth() - 1);
      let dateStr1 = d.getFullYear()
      let mm1 = d.getMonth() + 1
      let ddd1 = d.getDate()
      if(mm1 < 10){
         dateStr1 += '0'+mm1
      }else{
         dateStr1 += ''+mm1
      }
      if(ddd1 < 10){
         dateStr1 += '0'+ddd1
      }else{
         dateStr1 += ''+ddd1
      }

      let url = config.appApiLink + 'exercise/userworkout?startDate='+dateStr1+'&endDate='+dateStr+'&userId='+id
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.get( url, apiHeader )
      .then( response => {
         setLoader(false)
         console.log(response.data)
         if(response.data && response.data.status === 'success'){
            if(response.data.data && response.data.data.length){
               setWorkOutHistory(response.data.data)
            }
         }else {
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
      fetchMyInfo()
   },[])

   const ddFormat = (date) => {
      let str = date.toString()
      return str[6]+''+str[7]+'/'+str[4]+''+str[5]+'/'+str[0]+''+str[1]+''+str[2]+''+str[3]
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

   const [activeIndex, setActiveIndex] = useState(0)

   const handleClick = (e, titleProps) => {
      const { index } = titleProps
      const newIndex = activeIndex === index ? -1 : index
      setActiveIndex(newIndex)
   }

   const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
   const getDay = date => {
      let str = date.toString()
      let dateFormat = str[0]+''+str[1]+''+str[2]+''+str[3]+'-'+str[4]+''+str[5]+'-'+str[6]+''+str[7]
      return days[new Date(dateFormat).getDay()]
   }

   return (
      <>
         <Navbar name={'My Profile'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="profile">
            <div className="heading">
               <div className="img" style={{backgroundImage: `url(${img})`}} ></div>
               <div className="infos">
                  <div><b>{name}</b></div>
                  <div>{email}</div>
                  <div>{phone}</div>
                  <div>{gymname}</div>
               </div>
            </div>

            {currentPackage.amount !== '' && <div className="package current-package">
               Current Package
               <div>Package Cost: <b><img className="rupee" src="rupee.png" />{currentPackage.amount}</b></div>
               <div>Package End Date: <b>{ddFormat(currentPackage.duedate)}</b></div>
               <div>Tenure: <b>{currentPackage.tenure} Month</b></div>
            </div>}

            {packageHistory.length > 0 && <div className="package history-package">
               Payment History 
               {packageHistory.map((v, i) => (
                  <div key={'his'+i} className="pack">
                     {v.transactions && v.transactions.length > 0 && v.transactions.map((j, x) => (
                        <div key={'tr'+v+'-'+i} className="history">
                           <span>Amount: <img className="rupee" src="rupee.png" />{j.amount}</span>
                           <span>Payment Date: {ddFormat(j.paymentDate)}</span>
                           <span>Mode: {j.paymentMode}</span>
                        </div>
                     ))}
                  </div>
               ))}
            </div>}

            {workOutHistory.length > 0 && <div className="package history-workout">
               Workout History
               {workOutHistory.map((v, i) => (
                  <Accordion fluid styled key={'workout'+i}>
                     <Accordion.Title
                        active={activeIndex === i}
                        index={i}
                        onClick={handleClick}
                     >
                        <Icon name='dropdown' />
                        <span>{ddFormat(v.date)}</span>&nbsp;({getDay(v.date)})&nbsp;
                        <span className="pull-right smallfont-margin">{getTime(v.time, v.endTime)}</span>
                     </Accordion.Title>
                     <Accordion.Content active={activeIndex === i}>
                        <b>Exercise:</b>
                        {v.exercises && v.exercises.length > 0 && v.exercises.map((j,x) => (
                           <p key={'exer'+v+'-'+x}>
                              <span>Name: {j.name}</span>
                              <span className="dur">Duration: {parseInt(j.time)/60} mins</span>
                           </p>
                        ))}
                     </Accordion.Content>

                  </Accordion>
               ))}
            </div>}
         </div>
      </>
   )
}

export default ViewMember