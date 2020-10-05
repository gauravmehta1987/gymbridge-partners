import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment } from 'semantic-ui-react'
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
         setLoader(false)
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
      fetchMyInfo()
   },[])

   const ddFormat = (date) => {
      let str = date.toString()
      return str[6]+''+str[7]+'/'+str[4]+''+str[5]+'/'+str[0]+''+str[1]+''+str[2]+''+str[3]
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
                        <div key={'tr'+v+i} className="history">
                           <span>Amount: <img className="rupee" src="rupee.png" />{j.amount}</span>
                           <span>Payment Date: {ddFormat(j.paymentDate)}</span>
                           <span>Mode: {j.paymentMode}</span>
                        </div>
                     ))}
                  </div>
               ))}
            </div>}

            <div className="package history-workout">
               Workput 
            </div>
         </div>
      </>
   )
}

export default ViewMember