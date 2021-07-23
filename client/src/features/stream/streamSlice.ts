import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  localStream: null | MediaStream;
  localCameraEnabled: boolean;
  localMicrophoneEnabled: boolean;
  remoteStreams: RemoteStream[];
  connections: any[];
  roomInfo: RoomInfo;
  roomInfoReady: boolean;
  mySocketId: null | string;
}

export interface RemoteStream {
  username: string;
  socketId: string;
  stream: MediaStream;
}

interface RoomInfo {
  roomId: string;
  roomName: string;
  hostId: string;
  hostName: string;
  allowVideo: boolean;
  allowAudio: boolean;
  admission: string;
  password: string;
  users: number;
}
const initialState: InitialState = {
  localStream: null,
  localCameraEnabled: true,
  localMicrophoneEnabled: true,
  remoteStreams: [],
  connections: [],
  roomInfo: {} as RoomInfo,
  roomInfoReady: false,
  mySocketId: null,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setLocalCameraEnabled: (state, action) => {
      state.localCameraEnabled = action.payload;
    },
    setLocalMicrophoneEnabled: (state, action) => {
      state.localMicrophoneEnabled = action.payload;
    },
    setRemoteStreams: (state, action) => {
      state.remoteStreams.push(action.payload);
    },
    removeRemoteStream: (state, action) => {
      state.remoteStreams = state.remoteStreams.filter(
        (stream) => stream.socketId !== action.payload
      );
    },
    setConnection: (state, action) => {
      state.connections.push(action.payload);
    },
    setRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
      state.roomInfoReady = true;
    },
    hostLeave: (state, _) => {
      state.connections = [];
      state.remoteStreams = [];
      state.roomInfo = {} as RoomInfo;
    },
    setSocketId: (state, action) => {
      state.mySocketId = action.payload;
    },
  },
});

export const {
  setLocalStream,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setRemoteStreams,
  removeRemoteStream,
  setConnection,
  setRoomInfo,
  hostLeave,
  setSocketId,
} = streamSlice.actions;

export default streamSlice.reducer;
