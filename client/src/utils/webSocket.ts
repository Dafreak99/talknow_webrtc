import { LocalStream } from "ion-sdk-js";
import io, { Socket } from "socket.io-client";
import { store } from "../app/store";
import { setMessage } from "../features/message/messageSlice";
import {
  enqueueJoinRequests,
  receiveShareScreen,
  removeUserScreen,
  setIsWhiteBoard,
  setRoomInfo,
} from "../features/room/roomSlice";
import {
  hostLeave,
  removeRemoteStream,
  setSocketId,
  setUsername,
} from "../features/stream/streamSlice";
import { ConfigRoom } from "../types";
import { connectIonSFU, handleUserJoined } from "./ionSFU";
import { handleScreen, handleSignaling } from "./webRTC";

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
    connectIonSFU();
  });

  socket.on("roominfo", (info) => store.dispatch(setRoomInfo(info)));

  socket.on("host-leave", () => store.dispatch(hostLeave(null)));

  socket.on("user-joined", handleUserJoined);

  socket.on("signal", gotMessageFromServer);

  socket.on("signal-screen", handleScreen);

  socket.on("broadcast-message", (data) => {
    store.dispatch(setMessage(data));
  });

  socket.on("share-screen", () => {
    const { isShareScreen } = store.getState().room.roomInfo;

    if (isShareScreen) {
      store.dispatch(removeUserScreen());
    }
    store.dispatch(receiveShareScreen(!isShareScreen));
  });

  socket.on("white-board", () => {
    store.dispatch(setIsWhiteBoard());
  });

  socket.on("request-to-join", (socketId, username) => {
    store.dispatch(enqueueJoinRequests({ socketId, username }));
  });

  socket.on("user-leave", (id) => {
    console.log(id);
    store.dispatch(removeRemoteStream(id));
  });
};

export const createRoom = (data: ConfigRoom) => {
  const { localStream } = store.getState().stream;

  socket.emit("user-joined", {
    data: { ...data, streamType: "host", streamId: localStream!.id },
    type: "host",
  });

  store.dispatch(setUsername(data.hostName));

  store.dispatch(
    setRoomInfo({ ...data, streamId: localStream!.id, users: [] })
  );
};

export const userJoined = (
  roomId: string,
  username: string,
  type: "guest" | "screen",
  screenShare?: LocalStream
) => {
  let localStream: LocalStream;

  if (type === "guest") {
    localStream = store.getState().stream.localStream as LocalStream;
    store.dispatch(setUsername(username));
  } else {
    localStream = screenShare as LocalStream;
  }

  socket.emit("user-joined", {
    data: { roomId, username, streamId: localStream!.id, streamType: type },
    type,
  });
};

export const requestToJoin = (
  roomId: string,
  username: string
): Promise<boolean> => {
  socket.emit("request-to-join", roomId, username);

  return new Promise((resolve, reject) => {
    socket.on("answer-requeqst-to-join", (isAccepted) => {
      resolve(isAccepted);
    });
  });
};

export const answerRequestToJoin = (data: {
  socketId: string;
  isAccepted: boolean;
}) => {
  socket.emit("answer-request-to-join", data);
};

export const getRoomInfo = (roomId: string) => {
  return new Promise((resolve, reject) => {
    socket.emit("get-room-info", roomId);

    socket.on("get-room-info", (data) => {
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

export const whiteBoardSignal = () => {
  socket.emit("white-board");
};
