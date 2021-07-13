import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GuestWaiting, Home, HostWaiting, Stream } from "./pages";

function App() {
  // const localStream = useAppSelector((state) => state.stream.localStream);
  // const remoteStreams = useAppSelector((state) => state.stream.remoteStreams);

  // const localVideoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   getLocalStream();
  // }, []);

  // useEffect(() => {
  //   if (localStream) {
  //     localVideoRef.current!.srcObject = localStream;
  //   }
  // }, [localStream]);

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/host-waiting" component={HostWaiting} exact />
        <Route path="/guest-waiting/:roomId" component={GuestWaiting} />
        <Route path="/stream" component={Stream} />
      </Switch>
    </Router>
    // <div style={{ height: "100vh", width: "100vw", background: "#000" }}>
    //   {localStream && <video ref={localVideoRef} muted playsInline autoPlay />}
    //   {remoteStreams.length > 0 &&
    //     remoteStreams.map((remoteStream, i) => (
    //       <RemoteStream key={i} remoteStream={remoteStream} />
    //     ))}
    // </div>
  );
}

export default App;
