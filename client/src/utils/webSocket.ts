import io, { Socket } from "socket.io-client";
import { setMessage } from "../features/message/messageSlice";
import {
  hostLeave,
  removeRemoteStream,
  setRoomInfo,
  setSocketId,
} from "../features/stream/streamSlice";
import { ConfigRoom } from "../types";
import { store } from "./../app/store";
import { handleScreen, handleSignaling, handleUserJoined } from "./webRTC";

let socket: Socket;
let socketId: undefined | string;

export const connect = async () => {
  socket = io("http://localhost:5000");

  socket.on("connect", function () {
    socketId = socket.id;

    store.dispatch(setSocketId(socketId));
  });

  socket.on("roominfo", (info) => store.dispatch(setRoomInfo(info)));

  socket.on("get-room-info", (data) => {
    console.log("get-room-info", data);
    if (data.status === "failed") {
    } else {
      store.dispatch(setRoomInfo(data.data));
    }
  });

  socket.on("host-leave", () => store.dispatch(hostLeave(null)));

  socket.on("user-joined", handleUserJoined);

  socket.on("signal", gotMessageFromServer);

  socket.on("signal-screen", handleScreen);

  socket.on("broadcast-message", (data) => {
    store.dispatch(setMessage(data));
  });

  socket.on("user-leave", (id) => {
    console.log(id);
    store.dispatch(removeRemoteStream(id));
  });
};

export const createRoom = (data: ConfigRoom) => {
  socket.emit("user-joined", { data, type: "host" });
};

export const userJoined = (roomId: string) => {
  socket.emit("user-joined", {
    data: { roomId, username: "Haitran" + Math.random() },
    type: "guest",
  });
};

export const getRoomInfo = (roomId: string) => {
  socket.emit("get-room-info", roomId);
};

export const confirmRoomPassword = (
  roomId: string,
  password: string
): Promise<{ status: string }> => {
  return new Promise((resolve, reject) => {
    socket.emit("confirm-room-password", roomId, password);

    socket.on("confirm-room-password", (data) => {
      resolve(data);
    });
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
  socket.emit("broadcast-message", { from: "haitran", content: message });
};

export const ionScreen = (initialize: boolean) => {
  socket.emit("ion-screen", initialize);
};
