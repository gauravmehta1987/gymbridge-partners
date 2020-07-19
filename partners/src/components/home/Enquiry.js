import React, { useState, useEffect } from 'react';
import ReactImageFallback from "react-image-fallback";
// import {isMobile} from 'react-device-detect'
import config from '../../config';
import axios from 'axios'

function Enquiry(){

   const [enquiryList, setEnquiryList] = useState([]);

   const fetchEnquiries = () => {
      setEnquiryList([])      
      let url = config.API_HOST+'/application/v1/enquiry?start=0&length=10&isAnd=A';
      let apiHeader = {
         headers: {
             'Content-Type': "application/json",
             'accept': "application/json",
             'Authorization': localStorage.getItem('token')
         }
     };
      axios.get( url, apiHeader )
      .then( response => {
         if(response.data){
            setEnquiryList(response.data.data)
         }
      })
      .catch( error => {
      console.log(error);
      } );      
    };

   useEffect(() => {
      fetchEnquiries();
    },[]);

   return (
      <>
         <div className="request-card clearfix">
            <div className="heading">
               <h2 className="floatLeft">Enquiries</h2>
               <span className="all-items">All Enquiry</span>
            </div>
            <div className="all-cards">
            {enquiryList.map((enquiry, index) => (
               <div className="ui card" key={"enq" + index}>
                  <div className="card">
                     <div className="image card-image">
                        <ReactImageFallback
                              src={config.MEDIA_LINK + "" + enquiry.PhotoId}
                              fallbackImage={process.env.PUBLIC_URL + '/img-thumb.png'}
                              alt="enquiry"
                              className="" />
                     </div>
                     <div className="info">
                        <div className="header">{enquiry.Name}</div>
                        <div className="meta"><span>{enquiry.Phone}</span></div>
                        <div className="meta"><span>{enquiry.Gender}</span></div>
                     </div>
                     <div className="action">Accept</div>
                  </div>
               </div>
            ))}
            </div>
         </div>
      </>
   )
}

export default Enquiry