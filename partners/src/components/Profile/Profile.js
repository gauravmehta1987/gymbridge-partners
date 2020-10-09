import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Button, Segment } from 'semantic-ui-react'
import './Profile.css'
import config from '../../config';
import axios from 'axios'
import { useAlert } from 'react-alert'
import { NavLink } from 'react-router-dom';

function Profile(){

   const [loader, setLoader] = useState(false)
   const alert = useAlert()

   const [name, setName] = useState('')
   const [address, setAddress] = useState('')
   const [phone, setPhone] = useState('')
   const [gymname, setGymname] = useState('')
   const [activeMembers, setActiveMembers] = useState('')
   const [inactiveMembers, setInactiveMembers] = useState('')
   const [packageList, setPackageList] = useState([])

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
         // console.log(response.data)
         if(response.data && response.data.status === 'success'){
            console.log(response.data.data.gym)
            if(response.data.data && response.data.data.ownerProfile && response.data.data.ownerProfile.gym){
               setName(response.data.data.ownerProfile.gym.OwnerName)
               setAddress(response.data.data.ownerProfile.gym.Address)
               setGymname(response.data.data.ownerProfile.gym.Name)
               if(response.data.data.ownerProfile.gym.packages && response.data.data.ownerProfile.gym.packages.length){
                  setPackageList(response.data.data.ownerProfile.gym.packages)
               }
            }
            setPhone(response.data.data.ownerProfile.MobileNumber)
            if(response.data.data && response.data.data.count){
               setActiveMembers(response.data.data.count.memberCount)
               setInactiveMembers(response.data.data.count.inactiveCount)
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

   return (
      <>
         <Navbar name={'My Profile'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="profile">
            <div className="heading">
               <div className="infos">
                  <div><b>Gym Name: {gymname}</b></div>
                  <div>Owner Name: {name}</div>
                  <div>Gym Contact: {phone}</div>
                  <div>Gym Address: {address}</div>
               </div>
            </div>
            <div className="package history-package">
               Members Count 
               <div>Active: {activeMembers}</div>
               <div>Inactive: {inactiveMembers}</div>
            </div>
            {packageList.length > 0 && <div className="package history-package">
               Package List 
               {packageList.map((v, i) => (
                  <div key={'pack'+i} className="pack">
                     <span>Name: {v.Name}</span>&nbsp;&nbsp;
                     <span>Cost: <img className="rupee" src="rupee.png" />{v.Cost}</span>&nbsp;&nbsp;
                     <span>Tenure: {v.Tenure} Months</span>
                  </div>
               ))}
            </div>}
            <div align="center" style={{paddingTop: '20px', display: 'inline-block'}}>
               <NavLink className="navigation" to="/Timing">
                  <Button color='green'>
                     View TImings
                  </Button>
               </NavLink>
            </div>
         </div>
      </>
   )
}

export default Profile