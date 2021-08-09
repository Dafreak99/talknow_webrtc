import { createSlice } from "@reduxjs/toolkit";
import { Room } from "../../types";

interface InitialState {
  roomInfoReady: boolean;
  roomInfo: Room;
}

const initialState: InitialState = {
  roomInfoReady: false,
  roomInfo: {
    isShareScreen: false,
    isWhiteBoard: false,
  } as Room,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomInfo: (state: InitialState, action) => {
      state.roomInfo = action.payload;
      state.roomInfoReady = true;
    },
    appendNewUser: (state: InitialState, action) => {
      state.roomInfo.users.push({
        ...action.payload,
        isSpeaking: false,
        stream: null,
      });
    },
    appendStreamToUser: (state: InitialState, action) => {
      let index = state.roomInfo.users.findIndex(
        (user) => user.streamId === action.payload.id
      );

      if (index === -1) return;

      const user = {
        ...state.roomInfo.users[index],
        stream: action.payload,
      };

      // state.roomInfo.users[index] = user;
      state.roomInfo.users[index].stream = new MediaStream(action.payload);
    },
    removeUser: (state: InitialState, action) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.streamId !== action.payload.id
      );
    },
    removeUserScreen: (state: InitialState) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.streamType !== "screen"
      );
    },
    clearRoomInfo: (state: InitialState, action) => {
      state.roomInfo = {} as Room;
      state.roomInfoReady = false;
    },
    receiveShareScreen: (state: InitialState, action) => {
      state.roomInfo.isShareScreen = action.payload;
    },
    setIsWhiteBoard: (state: InitialState) => {
      const { isWhiteBoard } = state.roomInfo;
      state.roomInfo.isWhiteBoard = !isWhiteBoard;
    },

    speaking: (state: InitialState, action) => {
      const index = state.roomInfo.users.findIndex(
        (user) => user.socketId === action.payload
      );

      if (index === -1) return;

      state.roomInfo.users[index].isSpeaking = true;
    },
    stopSpeaking: (state: InitialState, action) => {
      const index = state.roomInfo.users.findIndex(
        (user) => user.socketId === action.payload
      );

      if (index === -1) return;

      state.roomInfo.users[index].isSpeaking = false;
    },
  },
});

export const {
  setRoomInfo,
  clearRoomInfo,
  receiveShareScreen,
  appendNewUser,
  appendStreamToUser,
  removeUser,
  removeUserScreen,
  setIsWhiteBoard,
  speaking,
  stopSpeaking,
} = roomSlice.actions;

export default roomSlice.reducer;
