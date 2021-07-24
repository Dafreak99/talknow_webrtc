import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GuestWaiting, Home, HostWaiting, Stream, Test } from "./pages";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/host-waiting" component={HostWaiting} exact />
        <Route path="/guest-waiting/:roomId" component={GuestWaiting} />
        <Route path="/stream" component={Stream} />
        <Route path="/test" component={Test} />
      </Switch>
    </Router>
  );
}

export default App;
