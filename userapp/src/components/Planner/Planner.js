import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import { Segment } from 'semantic-ui-react'

function Planner(){
   
   const [loader, setLoader] = useState(false)

   return (
      <>
         <Navbar name={'Planner'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="container dashboard">
            <div className="moreinfos">
               <div className="book-session">
                  <NavLink to="/Customized">Customized</NavLink>
               </div>
            </div>
            <div className="moreinfos">
               <div className="book-session">
                  <NavLink to="/Assisted">Assisted</NavLink>
               </div>
            </div>
         </div>
      </>
   )
}

export default Planner