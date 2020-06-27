import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import OtpInput from 'react-otp-input';
import './Login.css';

function Login(){


    
    const [showOTP, setShowOTP] = useState(false)
    

    
    return(
        <>
                        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                            <Grid.Column style={{ maxWidth: 450 }}>
                                {/* <Header as='h2' color='teal' textAlign='center'>
                                    <Image src='/logo.png' /> Log-in to your account
                                </Header> */}
                                <Form size='large'>
                                    <Segment stacked>
                                        <Form.Input fluid icon='user' iconPosition='left' placeholder='Phone number' />
                                        <Form.Input fluid icon='key' iconPosition='left' placeholder='Enter OTP' />
                                        
                                                     
                                        
                                        {/* <OtpInput
                                            style={{color:'#000000'}}
                                            onChange={otp => console.log(otp)}
                                            numInputs={4}
                                            separator={<span>-</span>}
                                        /> */}
                                        <Button color='black' fluid size='large' style={{marginTop:'20px'}}>
                                            Login
                                        </Button>
                                    </Segment>
                                </Form>
                                
                            </Grid.Column>
                        </Grid>
        </>
    );
}

export default Login;