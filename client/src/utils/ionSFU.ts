import { createStandaloneToast } from "@chakra-ui/react";
import { Client, Constraints, LocalStream, RemoteStream } from "ion-sdk-js";
import { Configuration } from "ion-sdk-js/lib/client";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";
import RecordRTC from "recordrtc";
import { store } from "../app/store";
import {
  appendNewUser,
  appendStreamToUser,
  removeUser,
} from "../features/room/roomSlice";
import {
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setLocalStream,
  setRecordScreenEnabled,
  setShareScreenEnabled,
} from "../features/stream/streamSlice";
import { User } from "../types";
import { shareScreenSignal, userJoined } from "./webSocket";

let client: any;
let screenClient: any;
let local: LocalStream;
let recorder: RecordRTC;

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
  const { mySocketId } = store.getState().stream;
  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  client = new Client(signal, config as Configuration);
  signal.onopen = () => client.join("test session", mySocketId);

  // Setup handlers
  client.ontrack = (track: MediaStreamTrack, stream: RemoteStream) => {
    track.onmute = () => {
      store.dispatch(appendStreamToUser(stream));
    };

    track.onunmute = () => {
      if (track.kind === "video") {
        store.dispatch(appendStreamToUser(stream));
      }
    };

    stream.onremovetrack = (e) => {
      store.dispatch(removeUser(stream));
    };
  };

  client.ondatachannel = (e: RTCDataChannelEvent) => {
    console.log(e);
    e.channel.onmessage = (e: MessageEvent) => {
      console.log("speaking...");
    };
  };

  local = await LocalStream.getUserMedia({
    audio: true,
    video: true,
    resolution: "vga",
    codec: "vp8",
  } as Constraints);

  store.dispatch(setLocalStream(local));
  const dc = client.createDataChannel("data");
  dc.onopen = () => dc.send("hello world");
};

export const publishPeer = () => {
  const { localStream } = store.getState().stream;
  client.publish(localStream);
};

export const handleUserJoined = (user: User) => {
  store.dispatch(appendNewUser(user));
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

export const toggleShareScreen = () => {
  const { shareScreenEnabled } = store.getState().stream;

  if (shareScreenEnabled) {
    shareScreenSignal();
    screenClient.leave();
  } else {
    shareScreen();
  }
  store.dispatch(setShareScreenEnabled(!shareScreenEnabled));
};

const displaymediastreamconstraints = {
  video: {
    displaySurface: "application", // monitor, window, application, browser
    logicalSurface: true,
    cursor: "always", // never, always, motion
  },
  audio: true,
};

/**
 * Share screen
 */
export const shareScreen = async () => {
  const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");

  screenClient = new Client(signal, config as Configuration);

  signal.onopen = () => screenClient.join("test session");

  try {
    const { roomId } = store.getState().room.roomInfo;
    const { mySocketId } = store.getState().stream;

    const screenShare = await LocalStream.getDisplayMedia({
      video: true,
      audio: true,
      resolution: "vga",
      codec: "vp8",
    } as Constraints);

    // If click stop share screen popup

    screenShare.getVideoTracks()[0].onended = () => toggleShareScreen();

    screenClient.publish(screenShare);
    shareScreenSignal();
    userJoined(roomId, `${mySocketId}  screen`, "screen", screenShare);
  } catch (error) {
    throw error;
  }
};

export const toggleRecord = async () => {
  const { recordScreenEnabled } = store.getState().stream;

  if (!recordScreenEnabled) {
    console.log("start recording");

    // @ts-ignore
    let screen = await navigator.mediaDevices.getDisplayMedia(
      displaymediastreamconstraints
    );

    recorder = new RecordRTC(
      screen as MediaStream,
      {
        type: "video",
        showMousePointer: true,
      } as {}
    );

    recorder.startRecording();
  } else {
    // @ts-ignore
    let { roomName } = store.getState().room.roomInfo;

    recorder.stopRecording((() => {
      let blob = recorder.getBlob();
      let fileName = `${roomName}_recording`;

      invokeSaveAsDialog(blob, fileName);
    }) as () => void);
  }

  store.dispatch(setRecordScreenEnabled(!recordScreenEnabled));
};

const generateFileFullName = (file: Blob, fileName: string) => {
  let fileExtension = (file.type || "video/webm").split("/")[1];
  if (fileExtension.indexOf(";") !== -1) {
    // extended mimetype, e.g. 'video/webm;codecs=vp8,opus'
    fileExtension = fileExtension.split(";")[0];
  }
  if (fileName && fileName.indexOf(".") !== -1) {
    let splitted = fileName.split(".");
    fileName = splitted[0];
    fileExtension = splitted[1];
  }

  const fileFullName =
    (fileName || Math.round(Math.random() * 9999999999) + 888888888) +
    "." +
    fileExtension;

  return fileFullName;
};

const invokeSaveAsDialog = (file: Blob, fileName: string) => {
  if (typeof navigator.msSaveBlob !== "undefined") {
    return navigator.msSaveBlob(file, "ok");
  }

  // if navigator is not present, manually create file and download
  var hyperlink = document.createElement("a");
  hyperlink.href = URL.createObjectURL(file);
  hyperlink.download = generateFileFullName(file, fileName);

  // @ts-ignore
  hyperlink.style = "display:none;opacity:0;color:transparent;";
  (document.body || document.documentElement).appendChild(hyperlink);

  if (typeof hyperlink.click === "function") {
    hyperlink.click();
  } else {
    hyperlink.target = "_blank";
    hyperlink.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  URL.revokeObjectURL(hyperlink.href);
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

// TODO: Debug handle join request. Figure out how to display Join Request as a form with Accept and Reject buttons
// https://clerk.dev/
