import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  messages: Message[];
}

interface Message {
  from: string;
  socketId: string;
  content: string;
}

const initialState: InitialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    setMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessage } = messageSlice.actions;

export default messageSlice.reducer;
