import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GuestWaiting, Home, HostWaiting, Stream } from "./pages";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/host-waiting" component={HostWaiting} exact />
        <Route path="/guest-waiting/:roomId" component={GuestWaiting} />
        <Route path="/stream" component={Stream} />
      </Switch>
    </Router>
  );
}

export default App;
