import React, { useEffect, Suspense, useContext, useState } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import useAuth from "./hooks/auth";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Notmember from "./components/Member/Notmember"
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const SessionBooking = React.lazy(() => {
  return import("./components/Booking/SessionBooking");
});

const PreviousBooking = React.lazy(() => {
  return import("./components/Booking/PreviousBooking");
});

const Planner  = React.lazy(() => {
  return import("./components/Planner/Planner");
});

const Customized  = React.lazy(() => {
  return import("./components/Planner/Customized");
});

const Assisted  = React.lazy(() => {
  return import("./components/Planner/Assisted");
});

const App = (props) => {
  // const [title, SetTitle] = useState("");

  // const titles = (a) => {
  //   SetTitle(a)
  // };

  const [status, SetStatus] = useState(false);

  const authContext = useContext(AuthContext)
  const { checkAuthState } = useAuth();

  const options = {
    timeout: 5000,
    position: positions.TOP_CENTER
  };

  useEffect(() => {
    checkAuthState();
    SetStatus(true)
  }, [checkAuthState]);

  let routes = (
    <Switch>
      <Route path="/" component={Login} />
    </Switch>
  );

  if (authContext.accessLevel === 1) {
    routes = (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/SessionBooking" render={(props) => <SessionBooking {...props} />} />
        <Route path="/PreviousBooking" render={(props) => <PreviousBooking {...props} />} />
        <Route path="/Planner" render={(props) => <Planner {...props} />} />
        <Route path="/Customized" render={(props) => <Customized {...props} />} />
        <Route path="/Assisted" render={(props) => <Assisted {...props} />} />
        <Redirect to="/" />
      </Switch>
    );
  } else if (authContext.accessLevel === 2) {
    routes = (
      <Switch>
        <Route path="/" exact component={Notmember} />
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
        {status && <Provider template={AlertTemplate} {...options}><Suspense fallback={<p>Loading...</p>}>{routes}</Suspense></Provider>}
    </>
  );
};

export default withRouter(App);
