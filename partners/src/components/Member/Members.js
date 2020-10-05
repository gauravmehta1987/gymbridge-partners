import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment, Radio } from 'semantic-ui-react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import './Members.css'
import config from '../../config'
import axios from 'axios'
import { useHistory } from 'react-router'


function Members(){

   const [loader, setLoader] = useState(false)
   const alert = useAlert()
   const history = useHistory()

   const [memberList, setMemberList] = useState([])

   const [currenttab, setCurrenttab] = useState('active')
   const [status, setStatus] = useState('Paid')

   const statusChange = (value) => {
      console.log(value)
      setStatus(value)
   }

   const fetchMembers = () => {
      setLoader(true)
      setMemberList([])
      let url = config.API_HOST+'/application/v1/member/getgymmembers?type='
      if(currenttab === 'active' && status === 'Due'){
         url += '0'
      }else if(currenttab === 'active' && status === 'Paid'){
         url += '1'
      }else {
         url = config.API_HOST+'/application/v1/signuprequests?requestStatus=2'
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
         setLoader(false)
         if(response.data){
            setMemberList(response.data.data)
         }else{
            alert.show(response.data.message)
         }
      })
      .catch( error => {
         setLoader(false)
         console.log(error);
         alert.show('api error')
      } );    
   }

   useEffect(() => {
      fetchMembers()
   }, [currenttab, status])

   const ddFormat = (date) => {
      let str = date.toString()
      return str[6]+''+str[7]+'/'+str[4]+''+str[5]+'/'+str[0]+''+str[1]+''+str[2]+''+str[3]
   }

   return (
      <>
         <Navbar name={'Member Listing'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="member-area">
            <div className="filter-area">
               <div className="tabs">
                  <div className={currenttab === 'active' ? 'active' : ''} onClick={() => (setCurrenttab('active'))}>Active</div>
                  <div className={currenttab === 'inactive' ? 'active' : ''} onClick={() => (setCurrenttab('inactive'))}>Inactive</div>
               </div>
               {currenttab === 'active' && <div className="status">
                  <div>Payment Status</div>
                  {/* <div className="paid">Paid</div>
                  <div className="due">Due</div> */}
                  <Radio
                     label='Paid'
                     name='radioGroup'
                     value={status}
                     checked={status === 'Paid'}
                     onChange={() => statusChange('Paid')}
                  />
                  <Radio
                     label='Due'
                     name='radioGroup'
                     value={status}
                     checked={status === 'Due'}
                     onChange={() => statusChange('Due')}
                  />
               </div>}
            </div>
            <div className="members-list">
               {memberList.length > 0 ? 
               memberList.map((member, i) => (
                  <div className={"member-view "+(currenttab === 'active' && status === 'Paid' ? 'green' : currenttab === 'active' && status === 'Due' ? 'red' : currenttab === 'inactive' ? 'yellow' : '')} key={'member'+i}>
                     <div className="img" style={{backgroundImage: 'url(sample.png)'}}></div>
                     <div className="text">
                        {member.joiningDate && <div className="name"><b>{member.name}</b><span className="dd">{ddFormat(member.joiningDate)}</span></div>}
                        {member.mobileNumber && <div className="name smallfont">{member.mobileNumber}</div>}
                        {member.subscriptions && member.subscriptions.length > 0 && 
                        <>
                           <div className="name smallfont">Tenure: {member.subscriptions[0].tenure} Months</div>
                           <div className="endDate">Package End Date: {ddFormat(member.subscriptions[0].endDate)}</div>
                        </>}
                     </div>
                  </div>
               ))
               : 'No Members'}
            </div>
         </div>
      </>
   )
}

export default Members