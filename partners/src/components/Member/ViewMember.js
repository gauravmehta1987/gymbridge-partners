import React, { useState, useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment, Radio } from 'semantic-ui-react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import './Members.css'
import config from '../../config'
import axios from 'axios'

function ViewMember(){

   const [loader, setLoader] = useState(false)
   const alert = useAlert()

   return (
      <>
         <Navbar name={'Member Listing'} />
         {loader && <Segment className="loader"></Segment>}
      </>
   )
}

export default ViewMember