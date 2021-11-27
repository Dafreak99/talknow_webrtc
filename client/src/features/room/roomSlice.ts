import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Request, Room } from '../../types';

interface InitialState {
  roomInfoReady: boolean;
  roomInfo: Room;
  roomId: null;
}

const initialState: InitialState = {
  roomInfoReady: false,
  roomInfo: {
    isShareScreen: false,
    isWhiteBoard: false,
    joinRequests: [] as Request[],
    updateLayout: 1,
  } as Room,
  roomId: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomInfo: (state: InitialState, action) => {
      state.roomInfo = { ...state.roomInfo, ...action.payload };
      state.roomInfoReady = true;
    },
    appendNewUser: (state: InitialState, action) => {
      state.roomInfo.users.push({
        ...action.payload,
        isSpeaking: false,
        stream: null,
        isCameraEnabled: false,
        isMicrophoneEnabled: true,
      });
    },
    appendStreamToUser: (state: InitialState, action) => {
      let index = state.roomInfo.users.findIndex(
        (user) => user.streamId === action.payload.id
      );

      if (index === -1) return;

      state.roomInfo.users[index].stream = new MediaStream(action.payload);
    },
    userToggleVideo: (state: InitialState, action) => {
      let index = state.roomInfo.users.findIndex(
        (user) => user.streamId === action.payload.id
      );

      if (index === -1) return;

      state.roomInfo.users[index].isCameraEnabled =
        !state.roomInfo.users[index].isCameraEnabled;
    },
    removeUser: (state: InitialState, action) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.streamId !== action.payload.id
      );
    },
    removeUserBySocketId: (state: InitialState, action) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.socketId !== action.payload
      );
    },
    removeUserScreen: (state: InitialState) => {
      state.roomInfo.users = state.roomInfo.users.filter(
        (user) => user.streamType !== 'screen'
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
      if (!state.roomInfo.users) return;

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
    enqueueJoinRequests: (
      state: InitialState,
      { payload }: PayloadAction<Request>
    ) => {
      state.roomInfo.joinRequests.push(payload);
    },
    dequeueJoinRequests: (state: InitialState) => {
      if (state.roomInfo.joinRequests.length === 1) {
        state.roomInfo.joinRequests = [];
      } else {
        state.roomInfo.joinRequests.shift();
      }
    },
    updateLayout: (state: InitialState) => {
      // Uses this function to update the layout by triggering the useEffect hook
      state.roomInfo.updateLayout = Math.random() * 1000;
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
  removeUserBySocketId,
  removeUserScreen,
  userToggleVideo,
  setIsWhiteBoard,
  speaking,
  stopSpeaking,
  enqueueJoinRequests,
  dequeueJoinRequests,
  updateLayout,
} = roomSlice.actions;

export default roomSlice.reducer;
