import io, { Socket } from "socket.io-client";
import {
  hostLeave,
  removeRemoteStream,
  setRoomInfo,
} from "../features/stream/streamSlice";
import { ConfigRoom } from "../types";
import { store } from "./../app/store";
import { handleSignaling, handleUserJoined } from "./webRTC";

let socket: Socket;
let socketId: undefined | string;

export const connect = async () => {
  socket = io("http://localhost:5000");

  socket.on("connect", function () {
    socketId = socket.id;
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

  socket.on("user-leave", (id) => {
    console.log(id);
    store.dispatch(removeRemoteStream(id));
  });
};

export const createRoom = (data: ConfigRoom) => {
  socket.emit("user-joined", { data, type: "host" });
  // socket.emit("user-joined", { roomId, username: faker.name.findName() });
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
