import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import OtpInput from 'react-otp-input';
import './Login.css';

function Login(){
    
    const [showOTP, setShowOTP] = useState(false);

    let [phone, setPhone] = useState('');

    const [error, setError] = useState(false);
    
    const handleClick = () => {
        if(phone && phone.length == 10){
            setShowOTP(true)
        }else{
            setError(true)
        }
    }

    const submit = () => {
        console.log(phone)

    }

    const getPhone = (e) => {
        setPhone(e.target.value)
        if(e.target.value && e.target.value.length == 10){
            setError(false)
        }else{
            setError(true)
        }
    }
    
    return(
        <>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                {/* <Header as='h2' color='teal' textAlign='center'>
                    <Image src='/logo.png' /> Log-in to your account
                </Header> */}
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Phone number' value={phone} onChange={(e) => getPhone(e)} />
                        {showOTP ? <Form.Input fluid icon='key' iconPosition='left' placeholder='Enter OTP' /> : null}
                        {error ? <div className="error-msg">Please check the phone number</div> : null}
                        
                        {/* <OtpInput
                            style={{color:'#000000'}}
                            onChange={otp => console.log(otp)}
                            numInputs={4}
                            separator={<span>-</span>}
                        /> */}
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