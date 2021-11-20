import { createSlice } from "@reduxjs/toolkit";
import { store } from "../../app/store";
import { updateLayout } from "../room/roomSlice";

interface InitialState {
	isShowedChat: boolean;
	newMessage: boolean;
	messages: Message[];
}

interface Message {
	from: string;
	socketId: string;
	content: string;
	timestamp: string;
	avatar: string;
}

const initialState: InitialState = {
	isShowedChat: true,
	newMessage: false,
	messages: [],
};

const messageSlice = createSlice({
	name: "message",
	initialState: initialState,
	reducers: {
		setToggleShowChat: (state) => {
			// When close messaage but receive new one
			if (!state.isShowedChat && state.newMessage) {
				state.newMessage = false;
			}

			state.isShowedChat = !state.isShowedChat;

		},
		setToggleNewMessage: (state) => {
			state.newMessage = !state.newMessage;
		},
		setMessage: (state, action) => {
			state.messages.push(action.payload);
		},
	},
});

export const { setMessage, setToggleShowChat, setToggleNewMessage } =
	messageSlice.actions;

export default messageSlice.reducer;
