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
    setRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
      state.roomInfoReady = true;
    },
    appendNewUser: (state, action) => {
      state.roomInfo.users.push(action.payload);
    },
    appendStreamToUser: (state, action) => {
      let index = state.roomInfo.users.findIndex(
        (user) => user.streamId === action.payload.id
      );

      if (index === -1) return;

      const user = {
        ...state.roomInfo.users[index],
        stream: action.payload,
      };

      state.roomInfo.users[index] = user;
    },
    removeUser: (state, action) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.streamId !== action.payload.id
      );
    },
    removeUserScreen: (state) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.streamType !== "screen"
      );
    },
    clearRoomInfo: (state, action) => {
      state.roomInfo = {} as Room;
      state.roomInfoReady = false;
    },
    receiveShareScreen: (state, action) => {
      state.roomInfo.isShareScreen = action.payload;
    },
    setIsWhiteBoard: (state) => {
      const { isWhiteBoard } = state.roomInfo;
      state.roomInfo.isWhiteBoard = !isWhiteBoard;
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
} = roomSlice.actions;

export default roomSlice.reducer;
