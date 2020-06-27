import React from 'react'
const ErrorHandling = WrappedComponent => ({showError, children}) => {
   return (
      <WrappedComponent>
         {showError && <div className="error-message"></div>}
      </WrappedComponent>
   );
}