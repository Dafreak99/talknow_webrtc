import { Client, Constraints, LocalStream, RemoteStream } from "ion-sdk-js";
import { Configuration } from "ion-sdk-js/lib/client";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { store } from "../app/store";
import {
  removeRemoteStream,
  setLocalStream,
  setRemoteStreams,
} from "../features/stream/streamSlice";
import renderer from "../utils/render";

let client: any;
let prevRemoteStreamId: string = "";

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const getLocalStream = async () => {
  renderer.init("video-container", 9 / 16, 8 / 5);

  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  client = new Client(signal, config as Configuration);
  signal.onopen = () => client.join("test session");

  // Setup handlers
  client.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
    console.log("stream", stream);
    console.log("track", track);

    if (track.kind === "video") {
      store.dispatch(
        setRemoteStreams({
          username: "123",
          stream,
          socketId: track.id,
        })
      );
    }

    stream.onremovetrack = (e) => {
      store.dispatch(removeRemoteStream(e.track.id));
    };
  };

  // Get a local stream
  const local = await LocalStream.getUserMedia({
    audio: true,
    video: true,
    resolution: "vga",
    codec: "vp8",
  } as Constraints);

  store.dispatch(setLocalStream(local));

  client.publish(local);
};

export const shareScreen = async () => {
  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  client = new Client(signal, config as Configuration);

  signal.onopen = () => client.join("test session");

  const screenShare = await LocalStream.getDisplayMedia({
    resolution: "vga",
    video: true,
    audio: true,
    codec: "vp8",
  } as Constraints);

  client.publish(screenShare);
};

// Reference this for auto layout
// https://github.com/menthays/auto-layout-for-video-call

// Whole screen capture
// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
