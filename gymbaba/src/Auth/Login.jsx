import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
// import OTPInput from 'react-otp-input';
// import OTPInput from "otp-input-react";
import './Login.css';
import "semantic-ui-css/semantic.min.css";
import axios from 'axios';
import config from '../config';
import { useHistory } from 'react-router';

function Login(){
    
    const [showOTP, setShowOTP] = useState(false);

    let [phone, setPhone] = useState('');

    const [OTP, setOTP] = useState("");

    const [error, setError] = useState(false);
    
    const handleClick = () => {
        if(phone && phone.length === 10){
            setShowOTP(true)
        }else{
            setError(true)
        }
    }

    const history = useHistory();

    const submit = () => {
        if(!phone || !OTP){
            return false
        }
        let url = config.API_HOST+"/application/v1/login";
        let obj = {
            mobilenumber: phone,
            otp: "d2a4827cfdc71b46ff518dbdcbc596befa12bbefb919cc8790d16836d25136dc"
        };
        let apiHeader = {
            headers: {
                'Content-Type': "application/json",
                'accept': "application/json"
            }
        };
        axios.post( url, obj, apiHeader)
        .then( response => {
            if(response.status){
                console.log(response.data.data)
                localStorage.setItem('userDetails', JSON.stringify(response.data.data.user));
                localStorage.setItem('token', response.data.data.token);
                history.push({
                    pathname:  "/"
                 })
            }  
        })
        .catch( error => {
        console.log(error);
        } );
    }

    const getPhone = (e) => {
        setPhone(e.target.value)
        if(e.target.value && e.target.value.length === 10){
            setError(false)
        }else{
            setError(true)
        }
    }

    const getOTP = (e) => {
        setOTP(e.target.value)
    }
    
    return(
        <>
        <Grid textAlign='center' verticalAlign='middle' className="login-page">
            <Grid.Column style={{ maxWidth: 450, margin: '0 10px' }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Image src='/logo.jpg' className="logo-img" /> <br />Partners
                </Header>
                <Form size='large'>
                    <p>Give us your mobile number<br /><br />To start, we need your mobile number linked to the gym.</p>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Mobile number' value={phone} onChange={(e) => getPhone(e)} />
                        {showOTP ? <Form.Input fluid icon='key' iconPosition='left' placeholder='Enter OTP' onChange={(e) => getOTP(e)} /> : null}
                        {error ? <div className="error-msg">Please check the mobile number</div> : null}
                        
                        {/* <OTPInput style={{color:'#000000'}} type="text" onChange={otp => console.log(otp)} numInputs={4} separator={<span>-</span>} /> */}
                        {/* <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false} secure /> */}
                        {!showOTP ? 
                        <Button color='black' fluid size='large' style={{marginTop:'20px'}} onClick={handleClick}>Continue</Button>:
                        <Button color='black' fluid size='large' style={{marginTop:'20px'}} onClick={submit}>Submit</Button>}
                    </Segment>
                </Form>
                
            </Grid.Column>
        </Grid>
        </>
    );
}

export default Login;