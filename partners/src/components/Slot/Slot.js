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
      let url = config.apiLink+'/onboarding/gym/summary/'+localStorage.getItem('gymId');
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
            localStorage.setItem('gymName', response.data.data.gymName);
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
         <Navbar name={'Create Slot'} />
         <div className="clearfix gym-main-div">
            {gymInfo?<div className="gym-container slot-content">
               <h3>{gymInfo.gymName}</h3>
               <div className="mbr-gallery-filter container gallery-filter-active">
                  <ul buttons="0">
                  {gymInfo.summary.cards && gymInfo.summary.cards.length > 0 && gymInfo.summary.cards.map((card, i) => (
                     <li className={"mbr-gallery-filter-all " + (i === 0 ? 'frst' : '')} key={"slot"+i}>
                        <div className="btn btn-md btn-primary-outline display-4 yes viewmode" onClick={(e) => viewSlot(e, card)}>
                           <div className="day-info" style={{height: (card.days.split(/[ ,]+/).length*40)+"px"}}>
                              <div className="center-align newlook">
                                 {/* {card.days.split(/[ ,]+/).join(' - ')} */}
                                 <div className="heading">Timings</div>
                                 <div className="more-info">
                                 {card.timings.split(',').map((tt, j) => (
                                    <div key={"tt"+i+"-"+j} className="">
                                       <span>{tt}</span>
                                    </div>
                                 ))}
                                 </div>
                                 <div style={{float: 'left',width: '100%',height: '10px'}} ></div>
                                 {card.days.split(/[ ,]+/).map((k,n) => (
                                    <div key={"dd"+i+"-"+n} className="">
                                       <span>{k}</span>
                                    </div>
                                 ))}
                              </div>
                              {/* <div className="view-slot">Click to View/Add Slot</div> */}
                           </div>
                        </div>
                     </li>
                  ))}
                  {gymInfo.summary.offDayArr && gymInfo.summary.offDayArr.length > 0  && gymInfo.summary.offDayArr[1] ?
                     <li className="mbr-gallery-filter-all">
                        <div className="btn btn-md btn-primary-outline display-4 not">
                           <div className="day-info" style={{height: (gymInfo.summary.offDayArr[1].split(',').length*30)+"px"}}>
                              <div className="center-align">
                                 {gymInfo.summary.offDayArr[1].split(/[ ,]+/).join(', ')}
                              </div>
                           </div>
                        </div>
                     </li>
                  :null}
                  </ul>
               </div>

            </div>:
            <Segment className="loader"></Segment>}
         </div>
      </>
   )
}

export default Slot