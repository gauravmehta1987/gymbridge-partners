import React, { useState, createContext } from 'react';

export const AuthContext = createContext({
    accessLevel: 0,
    setAccessLevel: () => {}
});

const AuthContextProvider = props => {
    
    const [permissionLevel, setPermissionLevel] = useState(0);

    const accessLevelHandler = (newLevel) => {
        setPermissionLevel(newLevel);
    }
    
    return (
        <AuthContext.Provider value={{setAccessLevel: accessLevelHandler, accessLevel: permissionLevel}}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;