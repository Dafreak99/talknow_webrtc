import { Client, Constraints, LocalStream, RemoteStream } from "ion-sdk-js";
import { Configuration } from "ion-sdk-js/lib/client";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import { store } from "../app/store";
import {
  removeRemoteStream,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setLocalStream,
  setRemoteStreams,
} from "../features/stream/streamSlice";

let client: any;
let local: LocalStream;

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

/**
 * Request to get the audio/video
 */
export const getLocalStream = async () => {
  // Get a local stream
  const local = await LocalStream.getUserMedia({
    audio: true,
    video: true,
    resolution: "vga",
    codec: "vp8",
  } as Constraints);

  store.dispatch(setLocalStream(local));
};

/**
 * Connect to IonSFU server
 */
export const connectIonSFU = async () => {
  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  client = new Client(signal, config as Configuration);
  signal.onopen = () => client.join("test session");

  // Setup handlers
  client.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
    track.onmute = () => {
      hanldeRemoteStreams(track, stream);
    };

    track.onunmute = () => {
      console.log(track.id);
      if (track.kind === "video") {
        hanldeRemoteStreams(track, stream);
      }
    };

    stream.onremovetrack = (e) => {
      store.dispatch(removeRemoteStream(e.track.id));
    };
  };

  local = await LocalStream.getUserMedia({
    audio: true,
    video: true,
    resolution: "vga",
    codec: "vp8",
  } as Constraints);

  store.dispatch(setLocalStream(local));

  client.publish(local);
};

const hanldeRemoteStreams = (track: MediaStreamTrack, stream: RemoteStream) => {
  store.dispatch(
    setRemoteStreams({
      username: "123",
      stream,
      socketId: track.id,
      trackId: track.id,
    })
  );
};

export const toggleCamera = () => {
  const { localCameraEnabled } = store.getState().stream;
  console.log(localCameraEnabled);

  if (localCameraEnabled) {
    local.mute("video");
    console.log("mute");
  } else {
    local.unmute("video");
    console.log("unmute");
  }

  store.dispatch(setLocalCameraEnabled(!localCameraEnabled));
};

export const toggleMic = () => {
  const { localMicrophoneEnabled } = store.getState().stream;

  if (localMicrophoneEnabled) {
    local.unmute("audio");
    console.log("unmute");
  } else {
    local.mute("audio");
    console.log("mute");
  }

  store.dispatch(setLocalMicrophoneEnabled(!localMicrophoneEnabled));
};

/**
 * Share screen
 */
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

// Whole screen capture
// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
