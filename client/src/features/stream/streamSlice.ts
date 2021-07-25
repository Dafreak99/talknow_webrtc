import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  localStream: null | MediaStream;
  localCameraEnabled: boolean;
  localMicrophoneEnabled: boolean;
  remoteStreams: RemoteStream[];
  connections: any[];
  mySocketId: null | string;
  myUsername: null | string;
  isShowedChat: boolean;
}

export interface RemoteStream {
  stream: MediaStream;
  username: string;
  socketId: string;
  trackId: string;
}

const initialState: InitialState = {
  localStream: null,
  localCameraEnabled: true,
  localMicrophoneEnabled: true,
  remoteStreams: [],
  connections: [],
  mySocketId: null,
  myUsername: null,
  isShowedChat: true,
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
      let index = state.remoteStreams.findIndex(
        (stream) => stream.trackId === action.payload.trackId
      );
      console.log(index);

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
    setToggleShowChat: (state) => {
      state.isShowedChat = !state.isShowedChat;
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
  hostLeave,
  setSocketId,
  setUsername,
  setToggleShowChat,
} = streamSlice.actions;

export default streamSlice.reducer;
