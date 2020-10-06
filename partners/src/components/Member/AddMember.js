import React, { useState } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment, Form, Modal, Button } from 'semantic-ui-react'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import DatePicker from 'react-date-picker'
import './Members.css'
import config from '../../config'
import axios from 'axios'
import { useHistory } from 'react-router'

function AddMember(){

   const [loader, setLoader] = useState(false)
   const alert = useAlert()
   const history = useHistory()

   const options = [
      { key: 1, text: 'Male', value: 'male' },
      { key: 2, text: 'Female', value: 'female' },
      { key: 3, text: 'Other', value: 'other' },
   ]

   const paymentModeOptions = [
      { key: 1, text: 'Credit Card', value: 'Credit Card' },
      { key: 2, text: 'Debit Card', value: 'Debit Card' },
      { key: 3, text: 'Cash', value: 'Cash' },
      { key: 4, text: 'Account', value: 'Account' },
      { key: 5, text: 'Paytm', value: 'Paytm' },
      { key: 6, text: 'UPI', value: 'UPI' },
   ]

   const months = [
      { key: '1', text: '1 Month', value: '1' },
      { key: '2', text: '2 Months', value: '2' },
      { key: '3', text: '3 Months', value: '3' },
      { key: '4', text: '4 Months', value: '4' },
      { key: '5', text: '5 Months', value: '5' },
      { key: '6', text: '6 Months', value: '6' },
      { key: '7', text: '7 Months', value: '7' },
      { key: '8', text: '8 Months', value: '8' },
      { key: '9', text: '9 Months', value: '9' },
      { key: '10', text: '10 Months', value: '10' },
      { key: '11', text: '11 Months', value: '11' },
      { key: '12', text: '12 Months', value: '11' },
   ]

   const paymentOptions = [
      { key: 'Full', value: 'Full', text: 'Full' },
      { key: 'Partial', value: 'Partial', text: 'Partial' }
    ]

   const [startDate, setStartDate] = useState(new Date())
   const [dueDate, setDueDate] = useState(new Date())
   const [amountPartial, setAmountPartial] = useState('')
   const [amountDue, setAmountDue] = useState('')
   const [payOption, setPayOption] = useState('Full')
   const [fullname, setFullname] = useState('')
   const [phone, setPhone] = useState('')
   const [regFee, setRegFee] = useState('')
   const [packCost, setPackCost] = useState('')
   const [gender, setGender] = useState('')
   const [tenure, setTenure] = useState('')
   const [paymentOpt, setPaymentOpt] = useState('')
   const [phoneInputError, setPhoneInputError] = useState(false)
   const [ttcost, setTtcose] = useState('')

   const [open, setOpen] = useState(false)

   const close = () => {
      setOpen(false);
   }

   const set_StartDate = (date) => {
      setStartDate(date)
   }

   const set_DueDate = (date) => {
      setDueDate(date)
   }

   const setpayOption = (e, value) => {
      setPayOption(value.value)
   }
   const setAmountpartial = (e, value) => {
      setAmountPartial(value.value)
      let val = packCost - value.value
      if(regFee){
         val += parseInt(regFee)
      }
      setAmountDue(val)
   }
   const setNameVal = (e, value) => {
      setFullname(value.value)
   }
   const setPhoneVal = (e, value) => {
      setPhone(value.value)
      if (value.value.length !== 10) {
         setPhoneInputError(true);
      } else {
         setPhoneInputError(false);
      }
   }
   const setRegFeeVal = (e, value) => {
      setRegFee(value.value)
      if(payOption === 'Full' && packCost){
         let ct = parseInt(value.value) + parseInt(packCost)
         setTtcose(ct)
      }
   }
   const setPackCostVal = (e, value) => {
      setPackCost(value.value)
      let ct = parseInt(value.value)
      if(regFee){
         ct += parseInt(regFee)
      }
      setTtcose(ct)
   }
   const setGenderVal = (e, value) => {
      setGender(value.value)
   }
   const setTenureVal = (e, value) => {
      setTenure(value.value)
   }
   const setAmountDueVal = (e) => {
   }
   const setPaymentModeVal = (e, value) => {
      setPaymentOpt(value.value)
   }

   const state = {
      button: 'now'
    };

   const submitForm = (e) => {
      e.preventDefault()
      // console.log(state.button)
      // console.log(fullname, phone, gender, regFee, packCost, startDate, tenure, payOption, amountPartial)

      let dd = new Date(startDate)
      let dateStr = dd.getFullYear()
      let mm = dd.getMonth() + 1
      let ddd = dd.getDate()
      if(mm < 10){
         dateStr += '0'+mm
      }else{
         dateStr += ''+mm
      }
      if(ddd < 10){
         dateStr += '0'+ddd
      }else{
         dateStr += ''+ddd
      }

      let dd1 = new Date(dueDate)
      let dateStr1 = dd1.getFullYear()
      let mm1 = dd1.getMonth() + 1
      let ddd1 = dd1.getDate()
      if(mm1 < 10){
         dateStr1 += '0'+mm1
      }else{
         dateStr1 += ''+mm1
      }
      if(ddd1 < 10){
         dateStr1 += '0'+ddd1
      }else{
         dateStr1 += ''+ddd1
      }

      if(state.button === 'later'){
         let obj = {
            "name": fullname,
            "mobileNumber": phone,
            "gymId": localStorage.getItem('gymId'),
            "paidAmt": 0,
            "tenure": tenure,
            "paymentAmt": packCost, // amountPartial while partial, full to packcost
            "paymentStatus": 0, // 0 for not paid, 1 for paid partial/full
            "startDate": dateStr,
            "genderId": options[options.findIndex((v) => v.value === gender)].key,
            "registerationAmt": regFee
         }

         if(payOption === 'Full'){
            obj.paidAmt = parseInt(packCost)
            if(regFee){
               obj.paidAmt += parseInt(regFee)
            }
         }else{
            obj.paidAmt = amountPartial
            obj.paymentDueDate = dateStr1
         }

         // console.log(obj)

         setLoader(true)
         let url = config.appApiLink + 'signup'
         let apiHeader = {
            headers: {
               'Content-Type': "application/json",
               'accept': "application/json",
               'Authorization': localStorage.getItem('token')
            }
         };
         axios.post( url, obj, apiHeader )
         .then( response => {
            setLoader(false)
            if(response.data && response.data.status === 'success'){
               alert.show('Member added successfully')
               setTimeout(function(){
                  history.push({
                     pathname: '/'
                  })
               },1000)
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
      }else {
         if(payOption === 'Partial' && (amountPartial === '' || amountPartial === 0)){
            alert.show('Please enter the amount')
            return false
         }
         setOpen(true)
      }
   }

   const save = (e) => {
      e.preventDefault()

      if(paymentOpt === ''){
         alert.show('Please select the payment mode')
         return false
      }

      let dd = new Date(startDate)
      let dateStr = dd.getFullYear()
      let mm = dd.getMonth() + 1
      let ddd = dd.getDate()
      if(mm < 10){
         dateStr += '0'+mm
      }else{
         dateStr += ''+mm
      }
      if(ddd < 10){
         dateStr += '0'+ddd
      }else{
         dateStr += ''+ddd
      }

      let dd1 = new Date(dueDate)
      let dateStr1 = dd1.getFullYear()
      let mm1 = dd1.getMonth() + 1
      let ddd1 = dd1.getDate()
      if(mm1 < 10){
         dateStr1 += '0'+mm1
      }else{
         dateStr1 += ''+mm1
      }
      if(ddd1 < 10){
         dateStr1 += '0'+ddd1
      }else{
         dateStr1 += ''+ddd1
      }

      let obj = {
         "name": fullname,
         "mobileNumber": phone,
         "gymId": localStorage.getItem('gymId'),
         "paidAmt": 0,
         "tenure": tenure,
         "paymentAmt": packCost, // amountPartial while partial, full to packcost
         "paymentStatus": 1, // 0 for not paid, 1 for paid partial/full
         "startDate": dateStr,
         "genderId": options[options.findIndex((v) => v.value === gender)].key,
         "registerationAmt": regFee,
         "paymentModeId": paymentModeOptions[paymentModeOptions.findIndex((v) => v.value === paymentOpt)].key
      }

      if(payOption === 'Full'){
         obj.paidAmt = parseInt(packCost)
         if(regFee){
            obj.paidAmt += parseInt(regFee)
         }
      }else{
         obj.paidAmt = amountPartial
         obj.paymentDueDate = dateStr1
      }

      // console.log(obj)

      setLoader(true)
      let url = config.appApiLink + 'signup'
      let apiHeader = {
         headers: {
            'Content-Type': "application/json",
            'accept': "application/json",
            'Authorization': localStorage.getItem('token')
         }
      };
      axios.post( url, obj, apiHeader )
      .then( response => {
         setLoader(false)
         if(response.data && response.data.status === 'success'){
            alert.show('Member added successfully')
            setTimeout(function(){
               history.push({
                  pathname: '/'
               })
            },1000)
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

   return (
      <>
         <Navbar name={'Add a new member'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="form-area">
            <Form onSubmit={submitForm}>
               <Form.Group widths='equal'>
                  <Form.Input fluid label='Name' defaultValue={fullname} onChange={setNameVal} placeholder='Name' required />
                  <Form.Input type='number' className={phoneInputError ? 'error': ''} onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } fluid label='Phone' defaultValue={phone} onChange={setPhoneVal} placeholder='Phone' required />
               </Form.Group>
               <Form.Group widths='equal'>
                  <Form.Select
                     fluid
                     label='Gender'
                     required
                     defaultValue={gender}
                     onChange={setGenderVal}
                     options={options}
                     placeholder='Gender'
                  />
                  <Form.Input fluid label='' placeholder='' style={{display: 'none'}} className="hide" />
               </Form.Group>
               <div className="seperatrion">
                  <Form.Group widths='equal'>
                     <Form.Input className="rupee" type='number' onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } fluid label='Registration Fees' defaultValue={regFee} onChange={setRegFeeVal} placeholder='Registration Fees' />
                     <Form.Input className="rupee" type='number' onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } fluid label='Package Cost' defaultValue={packCost} onChange={setPackCostVal} placeholder='Package Cost' required />
                  </Form.Group>
                  <Form.Group>
                     <Form.Select
                        fluid
                        label='Package Tenure'
                        required
                        className="halfdivison"
                        defaultValue={tenure}
                        onChange={setTenureVal}
                        options={months}
                        placeholder='Select Month'
                     />
                     <div className="calender halfdivison">
                        <label style={{marginBottom: '13px'}}>start date*</label>
                        <span className="inline">
                           <DatePicker
                              value={startDate}
                              onChange={set_StartDate}
                              placeholderText="Select a date"
                              className="datepicker"
                              format='d-MM-y'
                              autoFocus={false}
                              clearIcon={null}
                           />
                        </span>
                     </div>
                  </Form.Group>
               </div>
               
               <div className="seperatrion">
                  <Form.Field >
                     <Form.Select
                        fluid
                        label='Payment Details'
                        required
                        defaultValue={payOption}
                        onChange={setpayOption}
                        options={paymentOptions}
                        placeholder='Payment Details'
                     />
                     {payOption === 'Full' && <Form.Input fluid label='Amount to be paid now' defaultValue={ttcost} placeholder='Amount to be paid now' readOnly />}
                     {payOption === 'Partial' && <>
                     <Form.Input className="rupee" type='number' onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } fluid label='Amount to be paid now' defaultValue={amountPartial} onChange={setAmountpartial} placeholder='Amount to be paid now' />
                     <Form.Group>
                        <Form.Input className="halfdivison" fluid label='Due amount' defaultValue={amountDue} onChange={setAmountDueVal} placeholder='Due amount' readOnly />
                        <Form.Group>
                           <div className="calender">
                              <label style={{marginBottom: '13px'}}>Due date*</label>
                              <span className="inline">
                                 <DatePicker
                                    value={dueDate}
                                    onChange={set_DueDate}
                                    placeholderText="Select a date"
                                    className="datepicker"
                                    format='d-MM-y'
                                    autoFocus={false}
                                    clearIcon={null}
                                 />
                              </span>
                           </div>
                        </Form.Group>
                     </Form.Group>
                     </>}
                  </Form.Field>
               </div>

               <Form.Group widths='equal'>
                  <Form.Button className="btn-green right" onClick={() => (state.button = 'now')}>Pay Now</Form.Button>
                  <Form.Button className="btn-green left" onClick={() => (state.button = 'later')}>Pay Later</Form.Button>
               </Form.Group>
            </Form>
         </div>

         <Modal open={open} onClose={close} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
            <Modal.Header>Add payment mode</Modal.Header>
            <Modal.Content image>
               <Modal.Description>
                  <Form.Group>
                     <Form.Select
                        fluid
                        label='Payment Mode'
                        required
                        className="noborder"
                        defaultValue={paymentOpt}
                        onChange={setPaymentModeVal}
                        options={paymentModeOptions}
                     />
                  </Form.Group>
               </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
               <Button color='black' onClick={close}>
                  Close
               </Button>
               <Button color='green' onClick={save}>
                  Save
               </Button>
            </Modal.Actions>
         </Modal>
      </>
   );
}

export default AddMember