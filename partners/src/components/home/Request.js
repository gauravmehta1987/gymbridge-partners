import React, { useState, useEffect } from 'react';
import ReactImageFallback from "react-image-fallback";
// import Carousel from "react-multi-carousel"
// import 'react-multi-carousel/lib/styles.css';
// import {isMobile} from 'react-device-detect'
import config from '../../config';
import axios from 'axios'

// const responsive = {
//    superLargeDesktop: {
//      // the naming can be any, depends on you.
//      breakpoint: { max: 4000, min: 3000 },
//      items: 4
//    },
//    desktop: {
//      breakpoint: { max: 3000, min: 1024 },
//      items: 4
//    },
//    tablet: {
//      breakpoint: { max: 1024, min: 464 },
//      items: 3
//    },
//    mobile: {
//      breakpoint: { max: 464, min: 0 },
//      items: 2
//    }
//  };

function Request(){

   const [requestList, setRequestList] = useState([]);

   const fetchRequests = () => {
      setRequestList([])      
      let url = config.API_HOST+'/application/v1/request?gymId=8';
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
            setRequestList(response.data.data)
         }
      })
      .catch( error => {
      console.log(error);
      } );      
    };

   useEffect(() => {
      fetchRequests();
    },[]);
   
   return (
      <>
         <div className="request-card clearfix">
            <div className="heading">
               <h2 className="floatLeft">Requests</h2>
               <span className="all-items">All Request</span>
            </div>
            <div className="all-cards">
            {/* <Carousel
                  swipeable={isMobile?true:false}
                  draggable={isMobile?true:false}
                  showDots={false}
                  responsive={responsive}
                  ssr={false}
                  infinite={true}
                  autoPlay={false}
                  customTransition="all .5"
                  containerClass="carousel-container"
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                  arrows={!isMobile ? true : false}
                  > */}
            

            {requestList.map((request, index) => (
               <div className="ui card" key={"req" + index}>
                  <div className="card">
                     <div className="image card-image">
                        <ReactImageFallback
                              src={config.MEDIA_LINK + "" + request.PhotoId}
                              fallbackImage={process.env.PUBLIC_URL + '/img-thumb.png'}
                              alt="request"
                              className="" />
                     </div>
                     <div className="info">
                        <div className="header">{request.Name}</div>
                        <div className="meta"><span>{request.Phone}</span></div>
                        <div className="meta"><span>{request.Gender}</span></div>
                     </div>
                     <div className="action">Accept</div>
                  </div>
               </div>
            ))}

            
            {/* </Carousel> */}
            </div>
         </div>
      </>
   )
}

export default Request