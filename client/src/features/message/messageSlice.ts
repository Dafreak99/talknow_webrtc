import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isShowedChat: boolean;
  messages: Message[];
}

interface Message {
  from: string;
  socketId: string;
  content: string;
  timestamp: string;
}

const initialState: InitialState = {
  isShowedChat: true,
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    setToggleShowChat: (state) => {
      state.isShowedChat = !state.isShowedChat;
    },
    setMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessage, setToggleShowChat } = messageSlice.actions;

export default messageSlice.reducer;
