import { genConfig } from "react-nice-avatar";
import io, { Socket } from "socket.io-client";
import { setMessage } from "../features/message/messageSlice";
import { receiveShareScreen, setRoomInfo } from "../features/room/roomSlice";
import {
  hostLeave,
  removeRemoteStream,
  setSocketId,
  setUsername,
} from "../features/stream/streamSlice";
import { ConfigRoom } from "../types";
import { store } from "./../app/store";
import { handleJoinRequest } from "./ionSFU";
import { handleScreen, handleSignaling, handleUserJoined } from "./webRTC";

let socket: Socket;
let socketId: undefined | string;

/**
 * Connect to Node.js signalling server
 */
export const connectSignallingServer = async () => {
  socket = io("http://localhost:5000");

  socket.on("connect", function () {
    socketId = socket.id;
    store.dispatch(setSocketId(socketId));
  });

  socket.on("roominfo", (info) => store.dispatch(setRoomInfo(info)));

  socket.on("host-leave", () => store.dispatch(hostLeave(null)));

  socket.on("user-joined", handleUserJoined);

  socket.on("signal", gotMessageFromServer);

  socket.on("signal-screen", handleScreen);

  socket.on("request-to-join", handleJoinRequest);

  socket.on("broadcast-message", (data) => {
    store.dispatch(setMessage(data));
  });

  socket.on("share-screen", () => {
    store.dispatch(receiveShareScreen());
  });

  socket.on("user-leave", (id) => {
    console.log(id);
    store.dispatch(removeRemoteStream(id));
  });
};

export const createRoom = (data: ConfigRoom) => {
  store.dispatch(setUsername(data.hostName));
  const config = genConfig();

  socket.emit("user-joined", { data: { ...data, config }, type: "host" });
};

export const userJoined = (roomId: string, username: string) => {
  store.dispatch(setUsername(username));
  const config = genConfig();

  socket.emit("user-joined", {
    data: { roomId, username, config },
    type: "guest",
  });
};

export const requestToJoin = (roomId: string, username: string) => {
  socket.emit("request-to-join", roomId, username);
};

export const getRoomInfo = (roomId: string) => {
  return new Promise((resolve, reject) => {
    socket.emit("get-room-info", roomId);

    socket.on("get-room-info", (data) => {
      console.log("get-room-info", data);
      if (data.status === "failed") {
        reject();
      } else {
        resolve(data);
        store.dispatch(setRoomInfo(data.data));
      }
    });
  });
};

export const confirmRoomPassword = (
  roomId: string,
  password: string
): Promise<{ status: string }> => {
  return new Promise((resolve, reject) => {
    socket.emit("confirm-room-password", roomId, password);

    socket.on("confirm-room-password", (data) => resolve(data));
  });
};

const gotMessageFromServer = async (fromId: string, signal: any) => {
  //Make sure it's not coming from yourself
  if (fromId !== socketId) {
    handleSignaling(fromId, signal);
  }
};

export const signaling = (id: string, data: any) => {
  socket.emit("signal", id, data);
};

export const screenShareSignaling = (
  to: string,
  data: {
    sdp: RTCSessionDescriptionInit;
  },
  event: string
) => {
  socket.emit("signal-screen", to, data, event);
};

export const screenShareSignaling2 = (
  to: string,
  data: { candidate: RTCIceCandidate },
  event: string
) => {
  socket.emit("signal-screen", to, data, event);
};

export const messaging = (message: string) => {
  socket.emit("broadcast-message", {
    from: "haitran",
    content: message,
    timestamp: new Date(),
  });
};

export const ionScreen = (initialize: boolean) => {
  socket.emit("ion-screen", initialize);
};

// NEW

export const shareScreenSignal = () => {
  socket.emit("share-screen");
};
