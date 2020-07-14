import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import './Login.css';
import "semantic-ui-css/semantic.min.css";
import useAuth from '../../hooks/auth';

function Login(){
    
    const [showOTP, setShowOTP] = useState(false);
    const {isLoading, accessLevel,networkError, sendSignInRequest} = useAuth();

    let [phone, setPhone] = useState('');

    const [OTP, setOTP] = useState("");

    const [error, setError] = useState(false);
    
    const handleClick = (e) => {
       e.preventDefault()
        if(phone && phone.length === 10){
            setShowOTP(true)
        }else{
            setError(true)
        }
    }

    const submit = (e) => {
      e.preventDefault()
        if(!phone || !OTP){
            return false
        }
        sendSignInRequest(phone,OTP);
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

    let serverErrorMessage = null;
    if ( networkError ) {
      serverErrorMessage = (
            <p style={{color: 'red'}}>{networkError}</p>
        );
    }

    let authRedirect = null;
    if ( accessLevel > 0 ) {
        authRedirect = <Redirect to="/dashboard" />
    }
    
    return(
        <>
        {authRedirect}
        {serverErrorMessage}
        <Grid textAlign='center' verticalAlign='middle' className="login-page">
            <Grid.Column style={{ maxWidth: 450, margin: '0 10px' }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Image src='/logo.jpg' className="logo-img" /> <br />Users
                </Header>
                <Form size='large'>
                    <p>Give us your mobile number<br /><br />To start, we need your mobile number linked to the gym.</p>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Mobile number' value={phone} onChange={(e) => getPhone(e)} />
                        {showOTP ? <Form.Input fluid icon='key' iconPosition='left' placeholder='Enter OTP' onChange={(e) => getOTP(e)} /> : null}
                        {error ? <div className="error-msg">Please check the mobile number</div> : null}
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