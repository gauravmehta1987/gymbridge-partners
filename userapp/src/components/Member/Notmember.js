import React, { useState, useEffect } from 'react'
import { Segment, Form, Modal, Button } from 'semantic-ui-react'
import './Member.css'

function Notmember(){

   const [startDate, setStartDate] = useState()
   const [dueDate, setDueDate] = useState()
   const [amountPartial, setAmountPartial] = useState('')
   const [amountDue, setAmountDue] = useState('')
   const [payOption, setPayOption] = useState('')
   const [fullname, setFullname] = useState('')
   const [phone, setPhone] = useState('')
   const [regFee, setRegFee] = useState('')
   const [packCost, setPackCost] = useState('')
   const [gender, setGender] = useState('')
   const [tenure, setTenure] = useState('')
   const [loader, setLoader] = useState(true)

   const proceed = (e) => {
      e.preventDefault()
      setOpen(true)
   }

   useEffect(() => {
      if(localStorage.getItem('notmember')){
         const data = JSON.parse(localStorage.getItem('notmember'))
         setFullname(data.Name)
         setPhone(data.MobileNumber)

         if(data.PaymentDueDate){
            setPayOption('Partial')
            let duDate = data.PaymentDueDate.toString()
            let strDu = duDate[6]+''+duDate[7]+'/'+duDate[4]+''+duDate[5]+'/'+duDate[0]+''+duDate[1]+''+duDate[2]+''+duDate[3]
            setDueDate(strDu)
         }

         let due = parseInt(data.PaymentAmt) + parseInt(data.RegisterationAmt) - parseInt(data.AmtToBePaid)
         setAmountDue(due)

         setRegFee(data.RegisterationAmt)
         setPackCost(data.PaymentAmt)
         setTenure(data.Tenure + ' Months')
         setAmountPartial(data.AmtToBePaid)

         let stDate = data.StartDate.toString()
         let str = stDate[6]+''+stDate[7]+'/'+stDate[4]+''+stDate[5]+'/'+stDate[0]+''+stDate[1]+''+stDate[2]+''+stDate[3]
         setStartDate(str)

         if(data.gender && data.gender.Name){
            setGender(data.gender.Name)
         }
      }
      setLoader(false)
   },[])

   const [open, setOpen] = useState(false)

   const close = () => {
      setOpen(false);
   }

   return (
      <>
      {loader && <Segment className="loader"></Segment>}
         <div style={{marginTop: '-50px'}}>
            <div className="form-area">
               <h2>Please review and pay to start your membership</h2>
               <Form>
                  <Form.Group widths='equal'>
                     <Form.Input fluid label='Name' defaultValue={fullname} readOnly placeholder='Name'  />
                     <Form.Input type='number' fluid label='Phone' defaultValue={phone} readOnly placeholder='Phone'  />
                  </Form.Group>
                  <Form.Group widths='equal'>
                     <Form.Input fluid label='Gender' defaultValue={gender} readOnly placeholder='Gender'  />
                     <Form.Input fluid label='' placeholder='' style={{display: 'none'}} className="hide" />
                  </Form.Group>
                  <div className="seperatrion">
                     <Form.Group widths='equal'>
                        <Form.Input className="rupee" type='number' fluid label='Registration Fees' defaultValue={regFee} readOnly placeholder='Registration Fees' />
                        <Form.Input className="rupee" type='number' fluid label='Package Cost' defaultValue={packCost} readOnly placeholder='Package Cost'  />
                     </Form.Group>
                     <Form.Group className="halfDivide">
                        <Form.Input fluid label='Package Tenure' defaultValue={tenure} readOnly placeholder='Package Tenure'  />
                        <Form.Input fluid label='Start Date' defaultValue={startDate} readOnly placeholder='Start Date'  />
                     </Form.Group>
                  </div>
                  
                  <div className="seperatrion">
                     <Form.Field >
                        <Form.Input fluid label='Payment Details' defaultValue={payOption} readOnly placeholder='Payment Details'  />
                        {payOption === 'Full' && <Form.Input fluid label='Amount to be paid now' defaultValue={packCost} placeholder='Amount to be paid now' readOnly />}
                        {payOption === 'Partial' && <>
                        <Form.Input className="rupee" type='number' fluid label='Amount to be paid now' defaultValue={amountPartial} readOnly placeholder='Amount to be paid now' />
                        <Form.Group className="halfDivide">
                           <Form.Input className="halfdivison" fluid label='Due amount' defaultValue={amountDue} readOnly placeholder='Due amount' readOnly />
                           <Form.Input fluid label='Due Date' defaultValue={dueDate} readOnly placeholder='Due Date'  />
                        </Form.Group>
                        </>}
                     </Form.Field>
                  </div>

                  <Form.Group widths='equal'>
                     <Form.Button className="btn-green right" onClick={proceed}>Proceed To Pay</Form.Button>
                  </Form.Group>
               </Form>
            </div>
         </div>
         <Modal open={open} onClose={close} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
            <Modal.Header>Payment Status</Modal.Header>
            {/* <Modal.Content image>
               <Modal.Description>
                  
               </Modal.Description>
            </Modal.Content> */}
            <Modal.Actions>
               <Button color='black' onClick={close}>
                  Payment Failure
               </Button>
               <Button color='green' onClick={close}>
                  Payment Success
               </Button>
            </Modal.Actions>
         </Modal>
      </>
   )
}

export default Notmember