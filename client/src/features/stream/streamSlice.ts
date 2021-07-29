import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  minimizeLocalStream: boolean;
  localStream: null | MediaStream;
  localCameraEnabled: boolean;
  localMicrophoneEnabled: boolean;
  shareScreenEnabled: boolean;
  recordScreenEnabled: boolean;
  remoteStreams: RemoteStream[];
  connections: any[];
  mySocketId: null | string;
  myUsername: null | string;
}

export interface RemoteStream {
  stream: MediaStream;
  username: string;
  socketId: string;
  trackId: string;
}

const initialState: InitialState = {
  minimizeLocalStream: false,
  localStream: null,
  localCameraEnabled: true,
  localMicrophoneEnabled: true,
  shareScreenEnabled: false,
  recordScreenEnabled: false,
  remoteStreams: [],
  connections: [],
  mySocketId: null,
  myUsername: null,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setMinimizeLocalstream: (state, action) => {
      state.minimizeLocalStream = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setLocalCameraEnabled: (state, action) => {
      state.localCameraEnabled = action.payload;
    },
    setLocalMicrophoneEnabled: (state, action) => {
      state.localMicrophoneEnabled = action.payload;
    },
    setShareScreenEnabled: (state, action) => {
      state.shareScreenEnabled = action.payload;
    },
    setRecordScreenEnabled: (state, action) => {
      state.recordScreenEnabled = action.payload;
    },
    setRemoteStreams: (state, action) => {
      let index = state.remoteStreams.findIndex(
        (stream) => stream.trackId === action.payload.trackId
      );

      if (index !== -1) {
        console.log("Existed");
        state.remoteStreams[index] = action.payload;
      } else {
        console.log("New");
        state.remoteStreams.push(action.payload);
      }
    },
    removeRemoteStream: (state, action) => {
      state.remoteStreams = state.remoteStreams.filter(
        (stream) => stream.socketId !== action.payload
      );
    },
    setConnection: (state, action) => {
      state.connections.push(action.payload);
    },
    hostLeave: (state, _) => {
      state.connections = [];
      state.remoteStreams = [];
    },
    setSocketId: (state, action) => {
      state.mySocketId = action.payload;
    },
    setUsername: (state, action) => {
      state.myUsername = action.payload;
    },
  },
});

export const {
  setMinimizeLocalstream,
  setLocalStream,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
  setShareScreenEnabled,
  setRecordScreenEnabled,
  setRemoteStreams,
  removeRemoteStream,
  setConnection,
  hostLeave,
  setSocketId,
  setUsername,
} = streamSlice.actions;

export default streamSlice.reducer;
