import { useReducer,useCallback, useContext } from "react"
import axios from 'axios';
import {AuthContext} from '../context/auth-context';
import config from '../config'

const authReducer = ( currentAuthState, action ) => {
    switch ( action.type ) {
        case 'AUTH_START': 
            return {token: null, loading: true, networkError: null, accessLevel: 0, authRedirectPath: '/'};
        case 'AUTH_SUCCESS': 
            return {
                ...currentAuthState,
                token: action.token,
                loading: false, 
                accessLevel: action.accessLevel
            }
        case 'AUTH_FAIL': 
            return {...currentAuthState, loading: false, networkError: action.networkError};
        case 'AUTH_LOGOUT': 
            return {token: null, loading: false, networkError: null, accessLevel: 0, authRedirectPath: '/'};
        default:
            throw new Error( 'Should not have reached here!' );
    }
};

const useAuth = () => {
    const [authState, dispatchAuth] = useReducer(authReducer, {
            token: null,
            networkError: null,
            loading: false,
            accessLevel: 0,
            authRedirectPath: '/'
        });
    const authContext = useContext(AuthContext);

    const sendSignInRequest = useCallback((phone, otp) => {
        dispatchAuth({type: 'AUTH_START'});

        let url = config.API_HOST+"/application/v1/loginv";
        let obj = {
            mobilenumber: phone,
            otp: "d2a4827cfdc71b46ff518dbdcbc596befa12bbefb919cc8790d16836d25136dc" // this is static but need to change
        };
        let apiHeader = {
            headers: {
                'Content-Type': "application/json",
                'accept': "application/json"
            }
        };
        axios.post( url, obj, apiHeader)
        .then( response => {
            console.log(response.data)
            if(response.data.status === 'success'){
                console.log(response.data.data)
                localStorage.setItem('userDetails', JSON.stringify(response.data.data.user));
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('gymId', response.data.data.user.gymId);
                localStorage.setItem('gym', JSON.stringify(response.data.data.gym));
                dispatchAuth({type: 'AUTH_SUCCESS', 
                    token: response.data.data.token,
                    accessLevel: 1
                });
                authContext.setAccessLevel(1);
            }else if(response.data.status === 'notPaid'){
                localStorage.setItem('token', 'notMember');
                localStorage.setItem('notmember', JSON.stringify(response.data.data));
                dispatchAuth({type: 'AUTH_SUCCESS', 
                    token: response.data.data.token,
                    accessLevel: 2
                });
                authContext.setAccessLevel(2);
            }else {
                console.log('[auth.js] SignIn Error: ' + response.data.message);
                dispatchAuth({type: 'AUTH_FAIL', networkError: response.data.message});
            }
        })
        .catch( error => {
            console.log(error);
            dispatchAuth({type: 'AUTH_FAIL', networkError: 'error'});
        } );
    },[authContext]);

    const sendSignOutRequest = useCallback((email, password) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('accessLevel');
        localStorage.removeItem('gymId');
        localStorage.removeItem('gymName');
        dispatchAuth({type: 'AUTH_LOGOUT'});
        authContext.setAccessLevel(0);
    },[authContext]);

    const checkAuthState = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatchAuth({type: 'AUTH_LOGOUT'});
            authContext.setAccessLevel(0);
        } else if(token === 'notMember') {
            dispatchAuth({type: 'AUTH_SUCCESS', 
                token: token,
                accessLevel: 2
            });
            authContext.setAccessLevel(2);
        } else {
            dispatchAuth({type: 'AUTH_SUCCESS', 
                token: token,
                accessLevel: 1
            });
            authContext.setAccessLevel(1);
        }
    },[authContext]);

    return {
        token: authState.token,
        networkError: authState.networkError,
        isLoading: authState.loading,
        accessLevel: authState.accessLevel,
        authRedirectPath: authState.authRedirectPath,
        sendSignInRequest: sendSignInRequest,
        sendSignOutRequest: sendSignOutRequest,
        checkAuthState: checkAuthState
    };
}

export default useAuth;