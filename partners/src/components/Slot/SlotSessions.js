import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import config from '../../config'
import axios from 'axios'
import { Segment, Modal, Button, Header, Image, Table } from 'semantic-ui-react'
import DatePicker from 'react-date-picker'
import { addDays } from 'date-fns'

function SlotSessions(){

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
   const [endDate, setEndDate] = useState(new Date())
   const [displayDate, setDisplayDate] = useState('')
   const [status, setStatus] = useState('')

   const changeStatus = (e) => {
      e.preventDefault()
      setStatus(e.target.value)
   }

   const [loader, setLoader] = useState(false)
   const [slotDetails, setSlotDetails] = useState([])

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
      let tt = getTime(data.startMinute, data.endMinute)
      setSessionTime(tt)
      setLoader(true)
      let url = config.appApiLink + "booking/users/" + data.id
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

   const set_StartDate = (date) => {
      setStartDate(date)
   }

   const set_EndDate = (date) => {
      setEndDate(date)
   }

   const getList = (e) => {
      e.preventDefault()

      let st = new Date(startDate)
      let stDate = st.getFullYear()
      let mm = parseInt(st.getMonth()+1)
      if(mm < 10){
         stDate += "0"+mm
      }else {
         stDate += mm
      }
      let dd = parseInt(st.getDate())
      if(dd < 10){
         stDate += "0"+dd
      }else {
         stDate += dd
      }

      let et = new Date(endDate)
      let etDate = et.getFullYear()
      let emm = parseInt(et.getMonth()+1)
      if(emm < 10){
         etDate += "0"+emm
      }else {
         etDate += emm
      }
      let edd = parseInt(et.getDate())
      if(edd < 10){
         etDate += "0"+edd
      }else {
         etDate += edd
      }

      setLoader(true)
      let url = config.appApiLink + "session/getSlotsDetailWithMemberCount?gymId="+19+"&enddate="+etDate+"&startdate="+stDate
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
            setSlotDetails([])
            if(response.data.data && response.data.data.length){
               response.data.data.forEach(function(v){
                  let newDate = v.date.toString()
                  let yy = newDate.substr(0, 4)
                  let mm = newDate.substr(4, 2)
                  let dd = newDate.substr(6, 2)
                  v.datview = dd+'/'+mm+'/'+yy
               })
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

   return (
      <>
         <Navbar name={'Slot Stats'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="slot-view gym-container slot-content">
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
               <span className="inline" style={{marginLeft: '10px'}}>
                  <DatePicker
                     value={endDate}
                     onChange={set_EndDate}
                     maxDate={addDays(new Date(), 1)}
                     placeholderText="Select a date"
                     className="datepicker"
                     format='d-MM-y'
                     autoFocus={false}
                     clearIcon={null}
                  />
               </span>
            </div>
            <div className="" style={{marginLeft: '10px', display: 'inline-block'}}><Button color='black' onClick={getList}>
                  Submit
               </Button></div>

            <div className="mbr-gallery-filter container gallery-filter-active tabsalign">
               <ul buttons="0">
                  {slotDetails && slotDetails.length> 0 ? slotDetails.map((card, i) => {
                     return <li className="mbr-gallery-filter-all" key={"slot"+i}>
                        <div className={"btn btn-md btn-primary-outline display-4 md-btn " + (i=== 0 && 'first')}>
                           <div className="day-info mm-info">
                              <div className="center-align">
                                 <span className="lchild pre">Date: {card.datview}</span>
                                 <div className="preview">
                                 {card.sessions.map((session, index) => (
                                    <div key={'st' + index} className="slot" onClick={(e) => viewSlot(e, session)}>
                                       {/* <span>{index+1}</span> */}
                                       <span>{session.attendanceCount}</span>
                                       <div className="slot-more-info" style={{width: '60px'}}>{getTime(session.startMinute, session.endMinute)}</div>
                                    </div>
                                 ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                     // return <li className="mbr-gallery-filter-all" key={"slot"+i}>
                     //    <div className="btn btn-md btn-primary-outline display-4 yes" onClick={(e) => viewSlot(e, mm)}>
                     //       <div className="day-info" style={{minHeight: '50px !important',height: '120px'}}>
                     //          <div className="center-align">
                     //             <div className="more-info">
                     //                {mm.sessions.map((session, index) => (
                     //                   <div key={'st' + index} className='slot'>
                     //                      <span>{index+1}</span>
                     //                      <div className="slot-more-info">{getTime(session.StartMinute, session.EndMinute)}</div>
                     //                   </div>
                     //                ))}
                                    
                     //             </div>
                     //          </div>
                     //          <div className="view-slot">Click to View Members</div>
                     //       </div>
                     //    </div>
                     // </li>
                     }) : <li className="mbr-gallery-filter-all nobooking"><div className="btn btn-md btn-primary-outline display-4 yes">No bookings</div></li>}
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

export default SlotSessions