import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import { Segment, Form, Modal, Button } from 'semantic-ui-react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useAlert } from 'react-alert'
import '../Member/Members.css'
import config from '../../config'
import axios from 'axios'

function Trainers(){

   const [loader, setLoader] = useState(false)
   const alert = useAlert()

   const options = [
      { key: 1, text: 'Male', value: 'male' },
      { key: 2, text: 'Female', value: 'female' },
      { key: 3, text: 'Other', value: 'other' },
   ]

   const [gymList, setGymList] = useState([])
   const [gymTypes, setGymTypes] = useState([])

   const fetchGymList = () => {
      setLoader(true)
      let url = config.API_HOST+'/application/v1/member/gymstaff'
      let apiHeader = {
         headers: {
            'Content-Type': "application/json",
            'accept': "application/json",
            'Authorization': localStorage.getItem('token')
         }
      };
      axios.get( url, apiHeader )
      .then( response => {
         setLoader(false)
         if(response.data){
            setGymList(response.data.data)
         }else{
            alert.show(response.data.message)
         }
      })
      .catch( error => {
         setLoader(false)
         console.log(error);
         alert.show('api error')
      } );
   }

   const fetchTrainerTypes = () => {
      let url = config.API_HOST+'/application/v1/member/gymstafftypes'
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
            if(response.data.data && response.data.data.length){
               response.data.data.forEach((v) => {
                  v.key = v.Id
                  v.text = v.Type
                  v.value = v.Type
               })
               setGymTypes(response.data.data)
            }
         }
      })
      .catch( error => {
         console.log(error);
      } );
   }

   useEffect(() => {
      fetchGymList()
      fetchTrainerTypes()
   },[])

   const ddFormat = (date) => {
      let str = date.toString()
      return str[6]+''+str[7]+'/'+str[4]+''+str[5]+'/'+str[0]+''+str[1]+''+str[2]+''+str[3]
   }

   const terminateTrainer = (e, card) => {
      e.preventDefault()
      confirmAlert({
         title: 'Are you sure to do this?',
         buttons: [
           {
             label: 'Yes',
             onClick: () => {
               setLoader(true)
               let url = config.appApiLink+'member/terminategymstaff?userId='+card.id
               let apiHeader = {
                  headers: {
                      'Content-Type': "application/json",
                      'accept': "application/json",
                      'Authorization': localStorage.getItem('token')
                  }
               };
               axios.delete( url, apiHeader )
               .then( response => {
                  if(response.data && response.data.status === 'success'){
                     console.log(response.data)
                     setLoader(false)
                     alert.show(response.data.message)
                     setTimeout(() => {
                        window.location.reload(false)
                     }, 2000)
                  }else {
                     console.log('error')
                     setLoader(false)
                     alert.show(response.data.message)
                  }
               })
               .catch( error => {
               setLoader(false)
               console.log(error);
               } );
             }
           },
           {
             label: 'No',
             onClick: () => console.log('No')
           }
         ]
       });
   }

   const [trainerModal, setTrainerModal] = useState(false)

   const addTrainer = () => {
      setTrainerModal(true)
   }

   const closeModal = () => {
      setTrainerModal(false)
   }

   const [trainerName, setTrainerName] = useState('')
   const [trainerEmail, setTrainerEmail] = useState('')
   const [trainerPhone, setTrainerPhone] = useState('')
   const [gender, setGender] = useState('')
   const [type, setType] = useState('')
   const [description, setDescription] = useState('')

   const [phoneInputError, setPhoneInputError] = useState(false)

   const saveTrainer = () => {
      // console.log(trainerName, trainerEmail, trainerPhone, gender, type)

      if(trainerName !== '' && trainerEmail !== '' && trainerPhone !== '' && gender !== '' && type !== ''){
         setLoader(true)
         let url = config.appApiLink+'member/gymstaff'
         let apiHeader = {
            headers: {
                'Content-Type': "application/json",
                'accept': "application/json",
                'Authorization': localStorage.getItem('token')
            }
         };
         let obj = {
            "mobilenumber": trainerPhone,
            "usertypeid": gymTypes[gymTypes.findIndex((v) => v.value === type)].key,
            "email": trainerEmail,
            "name": trainerName,
            "genderId": options[options.findIndex((v) => v.value === gender)].key
         }
         console.log(obj)
         axios.post( url, obj, apiHeader )
         .then( response => {
            if(response.data && response.data.status === 'success'){
               console.log(response.data)
               setLoader(false)
               alert.show(response.data.message)
               setTimeout(() => {
                  window.location.reload(false)
               }, 2000)
            }else {
               console.log('error')
               setLoader(false)
               alert.show(response.data.message)
            }
         })
         .catch( error => {
         setLoader(false)
         console.log(error);
         } );
      }
   }

   const setNameVal = (e, value) => {
      setTrainerName(value.value)
   }
   const setEmailVal = (e, value) => {
      setTrainerEmail(value.value)
   }
   const setPhoneVal = (e, value) => {
      setTrainerPhone(value.value)
      if (value.value.length !== 10) {
         setPhoneInputError(true);
      } else {
         setPhoneInputError(false);
      }
   }
   const setGenderVal = (e, value) => {
      setGender(value.value)
   }
   const setTypeVal = (e, value) => {
      setType(value.value)
   }
   const setDescVal = (e, value) => {
      setDescription(value.value)
   }

   const [trainerInfo, setTrainerInfo] = useState({
      name: '', phone:'', email: '', gender: '', type: '', description: ''
   })

   const [viewModal, setViewModal] = useState(false)

   const viewTrainer = (e, data) => {
      e.preventDefault()
      console.log(data)
      setTrainerInfo({
         ...trainerInfo,
         name: data.name, phone: data.mobileNumber, email: data.email, gender: data.gender.Name, type: data.userType.Type, description: ''
      })
      setViewModal(true)
   }

   const closeViewModal = () => {
      setViewModal(false)
   } 

   return (
      <>
         <Navbar name={'Trainers'} />
         {loader && <Segment className="loader"></Segment>}
         <div className="add-trainer">
            <Button color='black' onClick={addTrainer}>
               Add
            </Button>
         </div>
         <div className="member-area" style={{paddingTop: '40px'}}>
            <div className="members-list">
               {gymList.length > 0 ? 
               gymList.map((gym, i) => (
                  <div className={"member-view "} key={'gym'+i}>
                     <div className="img" style={{backgroundImage: `url(${gym.photo})`}}></div>
                     <div className="text">
                        <div className="name"><b>{gym.name}</b><span className="dd">{ddFormat(gym.joiningDate)}</span></div>
                        <div className="name smallfont">{gym.mobileNumber}</div>
                        {gym.gender && gym.gender.Name && <div className="name smallfont">{gym.gender.Name}</div>}
                        {gym.userType && gym.userType.Type && <div className="name smallfont">{gym.userType.Type}</div>}
                        <div className="view-trainer" onClick={(e) => viewTrainer(e, gym)}>View</div>
                        <div className="actions-bttn">
                           <Button color='black' onClick={(e) => terminateTrainer(e, gym)}>
                              Terminate
                           </Button>
                        </div>
                     </div>
                  </div>
               ))
               : 'No Members'}
            </div>
         </div>

         {trainerModal && <Modal open={trainerModal} onClose={closeModal} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
            <Modal.Header>Add Trainer</Modal.Header>
            <Modal.Content image className="overhide">
               <Modal.Description>
               <div className="add-form form-area" style={{padding: '0'}}>
                  <Form onSubmit={saveTrainer}>
                     <Form.Group widths='equal'>
                        <Form.Input fluid label='Name' defaultValue={trainerName} onChange={setNameVal} placeholder='Name' required />
                        <Form.Input type='number' className={phoneInputError ? 'error': ''} onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } fluid label='Phone' defaultValue={trainerPhone} onChange={setPhoneVal} placeholder='Phone' required />
                     </Form.Group>
                     <Form.Group widths='equal'>
                        <Form.Input fluid label='Email' defaultValue={trainerEmail} onChange={setEmailVal} placeholder='Email' required />
                        <Form.Input fluid label='' placeholder='' style={{display: 'none'}} className="hide" />
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
                     <Form.Group widths='equal'>
                        <Form.Select
                           fluid
                           label='Position'
                           required
                           defaultValue={type}
                           onChange={setTypeVal}
                           options={gymTypes}
                           placeholder='Position'
                        />
                        <Form.Input fluid label='' placeholder='' style={{display: 'none'}} className="hide" />
                     </Form.Group>
                     <Form.TextArea label='Description' defaultValue={description} onChange={setDescVal} placeholder='Tell us more about ...' />
                     <Form.Group>
                        <Form.Button className="btn-black right" onClick={closeModal}>Close</Form.Button>
                        <Form.Button className="btn-green left" type="submit">Add</Form.Button>
                     </Form.Group>
                  </Form>
               </div>
               </Modal.Description>
            </Modal.Content>
         </Modal>}

         {viewModal && <Modal open={viewModal} onClose={closeViewModal} closeOnEscape={false} closeOnDimmerClick={false} className='custom'>
            <Modal.Header>View Trainer</Modal.Header>
            <Modal.Content image className="overhide">
               <Modal.Description>
               <div className="add-form form-area" style={{padding: '0'}}>

                  Name: <b>{trainerInfo.name}</b><br />
                  Email: <b>{trainerInfo.email}</b><br />
                  Phone: <b>{trainerInfo.phone}</b><br />
                  Gender: <b>{trainerInfo.gender}</b><br />
                  Position: <b>{trainerInfo.type}</b><br />
                  Description: <b>{trainerInfo.description}</b><br /><br />
               
                  <Form.Group>
                     <Form.Button className="btn-black right" onClick={closeViewModal}>Close</Form.Button>
                  </Form.Group>
               
               </div>
               </Modal.Description>
            </Modal.Content>
         </Modal>}
      </>
   )
}

export default Trainers