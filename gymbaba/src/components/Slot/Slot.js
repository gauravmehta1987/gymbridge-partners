import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Loader, Segment } from 'semantic-ui-react'
import '../Profile/Profile.css'
import config from '../../config';
import axios from 'axios'
import './Slot.css'
import { useHistory } from 'react-router';

function Slot(){

   const [gymInfo, setGymInfo] = useState('');

   const history = useHistory();

   const fetchGymData = () => {
      setGymInfo('');
      let url = config.apiLink+'/onboarding/gym/summary/8';
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
      };
      axios.get( url, apiHeader )
      .then( response => {
         if(response.data && response.data.status){
            setGymInfo(response.data.data)
         }
      })
      .catch( error => {
      console.log(error);
      } );      
    };

   useEffect(() => {
      fetchGymData();
    },[]);
   
   const viewSlot =(e, card) => {
      e.preventDefault()
      history.push({
         // pathname: `/slotbooking`
         pathname: `/slotbooking/${card.days}`
      })
   }

   return (
      <>
         <Navbar name={'Slot Booking'} />
         <div className="clearfix gym-main-div">
            {gymInfo?<div className="gym-container slot-content">
               <h3>{gymInfo.gymName}</h3>
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                  {gymInfo.summary.cards && gymInfo.summary.cards.length > 0 && gymInfo.summary.cards.map((card, i) => (
                     <li className="mbr-gallery-filter-all" key={"slot"+i}>
                        <div className={"btn btn-md btn-primary-outline display-4 " + (i=== 0 && 'first')} onClick={(e) => viewSlot(e, card)}>
                           <div className="day-info" style={{height: (card.timings.split(',').length*40)+"px"}}>
                              <div className="center-align">
                                 {card.days.split(/[ ,]+/).join(' - ')}
                                 <div className="more-info">
                                 {card.timings.split(',').map((tt, j) => (
                                    <div key={"tt"+i+"-"+j} className="">
                                       <span>{tt}</span>
                                    </div>
                                 ))}
                                 </div>
                              </div>
                              <div className="view-slot">Click to View/Add Slot</div>
                           </div>
                        </div>
                     </li>
                  ))}
                  {gymInfo.summary.offDayArr && gymInfo.summary.offDayArr.length > 0 ?
                     <li className="mbr-gallery-filter-all">
                        <div className="btn btn-md btn-primary-outline display-4 not">
                           <div className="day-info" style={{height: (gymInfo.summary.offDayArr[1].split(',').length*30)+"px"}}>
                              <div className="center-align">
                                 {gymInfo.summary.offDayArr[1].split(/[ ,]+/).join(' ,')}
                              </div>
                           </div>
                        </div>
                     </li>
                  :null}
                  </ul>
               </div>

            </div>:
            <Segment>
               <Loader active />
            </Segment>}
         </div>
      </>
   )
}

export default Slot