import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  GuestWaiting,
  Home,
  HostWaiting,
  Stream,
  SignIn,
  SignUp,
} from './pages';

const frontendApi = process.env.REACT_APP_CLERK_FRONTEND_API;

function App() {
  const { push } = useHistory();

  return (
    <ClerkProvider frontendApi={frontendApi} navigate={(to) => push(to)}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/host-waiting" component={HostWaiting} exact />
        <Route path="/guest-waiting/:roomId" component={GuestWaiting} />
        <Route path="/stream" component={Stream} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
      </Switch>
    </ClerkProvider>
  );
}

export default App;
