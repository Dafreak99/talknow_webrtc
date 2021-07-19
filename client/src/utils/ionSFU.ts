import { Client, Constraints, LocalStream, RemoteStream } from "ion-sdk-js";
import { Configuration } from "ion-sdk-js/lib/client";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { store } from "../app/store";
import {
  setLocalStream,
  setRemoteStreams,
} from "../features/stream/streamSlice";

let client: any;
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const getLocalStream = async () => {
  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  client = new Client(signal, config as Configuration);
  signal.onopen = () => client.join("test session", "haha" + Math.random());

  // Setup handlers
  client.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
    if (track.kind === "video") {
      store.dispatch(
        setRemoteStreams({
          username: "123",
          stream,
          //   socketId: socketId,
        })
      );
    }
  };

  client.ondatachannel = (e: any) => {
    console.log(e);
  };

  // Get a local stream
  const local = await LocalStream.getUserMedia({
    audio: true,
    video: true,
    simulcast: true, // enable simulcast
  } as Constraints);

  store.dispatch(setLocalStream(local));
  client.publish(local);

  const dc = client.createDataChannel("data");
  dc.onopen = () => dc.send("hello world");
};
