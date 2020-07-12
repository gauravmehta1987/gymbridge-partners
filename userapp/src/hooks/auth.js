import { useReducer,useCallback, useContext } from "react"
import axios from 'axios';
import {AuthContext} from '../context/auth-context';
import Config from '../config'

const authReducer = ( currentAuthState, action ) => {
    switch ( action.type ) {
        case 'AUTH_START': 
            return {token: null, userId: null, loading: true, networkError: null, accessLevel: 0, authRedirectPath: '/'};
        case 'AUTH_SUCCESS': 
            return {
                ...currentAuthState,
                token: action.token, 
                userId: action.userId, 
                loading: false, 
                accessLevel: action.accessLevel
            }
        case 'AUTH_FAIL': 
            return {...currentAuthState, loading: false, networkError: action.networkError};
        case 'AUTH_LOGOUT': 
            return {token: null, userId: null, loading: false, networkError: null, accessLevel: 0, authRedirectPath: '/'};
        case 'SET_AUTH_REDIRECT_PATH': 
            return {...currentAuthState, authRedirectPath: action.authRedirectPath}
        default:
            throw new Error( 'Should not have reached here!' );
    }
};

const useAuth = () => {
    const [authState, dispatchAuth] = useReducer(authReducer, {
            token: null,
            userId: null,
            networkError: null,
            loading: false,
            accessLevel: 0,
            authRedirectPath: '/'
        });
    const authContext = useContext(AuthContext);

        const sendSignInRequest = useCallback((email, password) => {
            dispatchAuth({type: 'AUTH_START'});
            const url = Config.SERVER_URL + '/_ah/api/loginEndpoints/v1/login?email='+email+'&password='+password;
            axios.post(url)
                .then( response => {
                    if(response.data.status) {
                        const expirationTimeInSec = 3600;
                        const expirationDate = new Date(new Date().getTime() + expirationTimeInSec * 1000);
                        const accessLevel = 3;
                        localStorage.setItem('token', response.data.provider.token);
                        localStorage.setItem('name', response.data.provider.name);
                        localStorage.setItem('email', response.data.provider.email);
                        localStorage.setItem('expirationDate', expirationDate);
                        localStorage.setItem('userId', response.data.provider.id);
                        localStorage.setItem('accessLevel', accessLevel);
                        dispatchAuth({type: 'AUTH_SUCCESS', 
                            token: response.data.provider.token, 
                            userId: response.data.provider.id, 
                            accessLevel: accessLevel
                        });
                        authContext.setAccessLevel(accessLevel);
                    }else {
                        console.log('[auth.js] SignIn Error: ' + response.data.errorMessage);
                        dispatchAuth({type: 'AUTH_FAIL', networkError: response.data.errorMessage});
                    }
                } )
                .catch( error => {
                    console.log('[auth.js] SignIn Network Error: ' + error.response.data.massage);
                    dispatchAuth({type: 'AUTH_FAIL', networkError: error.response.data.massage});
                } );
        },[authContext]);

        const sendSignOutRequest = useCallback((email, password) => {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('expirationDate');
            localStorage.removeItem('userId');
            localStorage.removeItem('accessLevel');
            dispatchAuth({type: 'AUTH_LOGOUT'});
            authContext.setAccessLevel(0);
        },[authContext]);

        const checkAuthState = useCallback(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                dispatchAuth({type: 'AUTH_LOGOUT'});
                authContext.setAccessLevel(0);
            } else {
                const expirationDate = new Date(localStorage.getItem('expirationDate'));
                if (expirationDate <= new Date()) {
                    dispatchAuth({type: 'AUTH_LOGOUT'});
                    authContext.setAccessLevel(0);
                } else {
                    const userId = localStorage.getItem('userId');
                    const accessLevel = localStorage.getItem('accessLevel');
                    dispatchAuth({type: 'AUTH_SUCCESS', 
                        token: token, 
                        userId: userId, 
                        accessLevel: accessLevel
                    });
                    authContext.setAccessLevel(accessLevel);
                }   
            }
        },[authContext]);

        return {
            token: authState.token,
            userId: authState.userId,
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