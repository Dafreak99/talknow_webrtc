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
  isShowedChat: boolean;
}

export interface RemoteStream {
  stream: MediaStream;
  username: string;
  socketId: string;
  trackId: string;
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
    // TODO: Continue to handle mic on/off
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
  setRoomInfo,
  hostLeave,
  setSocketId,
  setToggleShowChat,
} = streamSlice.actions;

export default streamSlice.reducer;
