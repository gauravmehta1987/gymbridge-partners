import React, { useEffect, Suspense, useContext, useState } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import useAuth from "./hooks/auth";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";

const App = (props) => {
  const [title, SetTitle] = useState("");

  const titles = (a) => {
    SetTitle(a)
  };

  const authContext = useContext(AuthContext)
  const { checkAuthState } = useAuth();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  let routes = (
    <Switch>
      <Route path="/" component={Login} />
    </Switch>
  );

  // console.log(authContext)

  if (authContext.accessLevel > 0) {
    routes = (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    return (
      <>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </>
    );
  }

  return (
    <>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </>
  );
};

export default withRouter(App);
