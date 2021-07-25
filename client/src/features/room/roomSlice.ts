import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  roomInfoReady: boolean;
  roomInfo: RoomInfo;
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
  isShareScreen: boolean;
  screenId: string;
}

const initialState: InitialState = {
  roomInfoReady: false,
  roomInfo: {} as RoomInfo,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
      state.roomInfoReady = true;
    },
    clearRoomInfo: (state, action) => {
      state.roomInfo = {} as RoomInfo;
      state.roomInfoReady = false;
    },
    receiveShareScreen: (state) => {
      state.roomInfo.isShareScreen = true;
    },
  },
});

export const { setRoomInfo, clearRoomInfo, receiveShareScreen } =
  roomSlice.actions;

export default roomSlice.reducer;
