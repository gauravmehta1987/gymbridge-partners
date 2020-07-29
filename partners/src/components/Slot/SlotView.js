import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import DatePicker from 'react-date-picker'
import { addDays } from 'date-fns'
import config from '../../config'
import axios from 'axios'
import { Segment, Modal, Button, Header, Image, Table } from 'semantic-ui-react'

function SlotView(){

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

   const [startDate, setStartDate] = useState(new Date())
   const [displayDate, setDisplayDate] = useState('')
   const [status, setStatus] = useState('Active')

   const changeStatus = (e) => {
      e.preventDefault()
      setStatus(e.target.value)
   }

   const [slotDetails, setSlotDetails] = useState([])
   const [loader, setLoader] = useState(false)

   const fetchSlotsData = () => {
      let date = new Date(startDate)
      let mm = parseInt(date.getMonth()+1)
      if(mm < 10){
         mm = "0"+mm
      }
      let dd = parseInt(date.getDate())
      if(dd < 10){
         dd = "0"+dd
      }
      let ddStr = date.getFullYear()+""+mm+""+dd
      let ddDate = dd+"-"+mm+"-"+date.getFullYear()
      setDisplayDate(ddDate)
      setLoader(true)
      let url = config.appApiLink + "bookings/" + ddStr + "?start=0&length=20"
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
            if(response.data.data && response.data.data.length){
               setSlotDetails(response.data.data)
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
      } );
   }

   useEffect(() => {
      fetchSlotsData();
    },[startDate]);

   const set_StartDate = (date) => {
      setStartDate(date)
   }

   const [members, setMembers] = useState([])
   const [memberList, setMemberList] = useState(false)
   const [sessionTime, setSessionTime] = useState('')
   const closeModal = () => {
      setMemberList([])
      setSessionTime('')
      setMemberList(false)
   }

   const viewSlot = (e, data) => {
      e.preventDefault()
      let tt = getTime(data.session.StartMinute, data.session.EndMinute)
      setSessionTime(tt)
      setLoader(true)
      let url = config.appApiLink + "booking/users/" + data.session.Id
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
            setMembers(response.data.data)
            setMemberList(true)
            setLoader(false)
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

   return (
      <>
         <Navbar name={'Slot Stats'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="slot-view gym-container slot-content">
            <div className="calender">
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
            </div>
            <div className="pull-left status">
               <select value={status} onChange={changeStatus}>
                  <option value='Active'>Active</option>
                  <option value='Process'>In Process</option>
               </select>
            </div>

            <div className="mbr-gallery-filter container gallery-filter-active">
               <ul buttons="0">
               {slotDetails && slotDetails.length > 0 ? slotDetails.map((slot, i) => status === slot.bookingStatus.Name && (
                  <li className="mbr-gallery-filter-all" key={"slot"+i}>
                     <div className="btn btn-md btn-primary-outline display-4 yes" onClick={(e) => viewSlot(e, slot)}>
                        <div className="day-info" style={{minHeight: '50px !important',height: '120px'}}>
                           <div className="center-align">
                              <div className="text-right">Booking Id: <b>{slot.Id}</b></div>
                              <div className="more-info">
                                 {slot.session && <span className="timeinfo">{getTime(slot.session.StartMinute, slot.session.EndMinute)}</span>}
                                 {slot.bookingStatus && <span className="tmName">Status: {slot.bookingStatus.Name}</span>}
                              </div>
                           </div>
                           <div className="view-slot">Click to View Members</div>
                        </div>
                     </div>
                  </li>
               )) : <li className="mbr-gallery-filter-all nobooking"><div className="btn btn-md btn-primary-outline display-4 yes">No bookings</div></li>}
               </ul>
            </div>

         </div>


         <Modal open={memberList} onClose={closeModal} closeOnEscape={false} closeOnDimmerClick={false} className='custom' id="member-session">
            <Modal.Header>Session Time: {sessionTime} <br/>Date: {displayDate}</Modal.Header>
            <Modal.Content image className="overhide">
               <Modal.Description>
               
               <Table basic='very' celled collapsing>
                  <Table.Header>
                     <Table.Row>
                     <Table.HeaderCell>Members</Table.HeaderCell>
                     </Table.Row>
                  </Table.Header>

                  <Table.Body>
                     {members.length> 0 && members.map((mm, id) => {
                     return <Table.Row key={"member" + id}>
                        <Table.Cell>
                        <Header as='h4' image>
                           <Image src='https://react.semantic-ui.com/images/avatar/small/mark.png' rounded size='mini' />
                           <Header.Content>
                           {mm.member.Name}
                              <Header.Subheader>{mm.member.MobileNumber}</Header.Subheader>
                              <Header.Subheader>{mm.member.Email}</Header.Subheader>
                           </Header.Content>
                        </Header>
                        </Table.Cell>
                     </Table.Row>
                     })}
                  </Table.Body>
               </Table>

               </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
               <Button color='black' onClick={closeModal}>
                  Close
               </Button>
            </Modal.Actions>
         </Modal>
         
      </>
   )
}

export default SlotView