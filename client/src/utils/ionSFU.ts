import { createStandaloneToast } from "@chakra-ui/react";
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
import { shareScreenSignal } from "./webSocket";

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
 * Connect to IonSFU server as well as get local stream
 */
export const connectIonSFU = async () => {
  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  client = new Client(signal, config as Configuration);
  signal.onopen = () => client.join("test session");

  // Setup handlers
  client.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
    console.log("track", track);
    console.log("stream", stream);
    track.onmute = () => {
      console.log(track.id);
      hanldeRemoteStreams(track, stream);
    };

    track.onunmute = () => {
      console.log(track.id);
      if (track.kind === "video") {
        hanldeRemoteStreams(track, stream);
      }
    };

    track.onisolationchange = () => {
      console.log("hey");
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
};

export const publishPeer = () => {
  const { localStream } = store.getState().stream;
  client.publish(localStream);
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
    local.mute("audio");
    console.log("unmute");
  } else {
    local.unmute("audio");
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

  try {
    const screenShare = await LocalStream.getDisplayMedia({
      video: true,
      audio: true,
      resolution: "vga",
      codec: "vp8",
    } as Constraints);

    client.publish(screenShare);
    shareScreenSignal();
  } catch (error) {
    throw error;
  }
};

export const leave = () => {
  client.leave();
};

// Whole screen capture
// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture

export const handleJoinRequest = (_: string, username: string) => {
  const toast = createStandaloneToast();

  toast({
    title: "An error occurred.",
    description: "Unable to create user account.",
    status: "success",
    duration: 9000,
    isClosable: true,
  });
};

// TODO: Debug handle join request
