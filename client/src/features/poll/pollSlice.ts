import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
  isPolled: boolean;
  isVoted: boolean;
  question: string;
  answers: Answer[];
}

export interface Answer {
  option: string;
  votes: number;
}

const initialState: InitialState = {
  isPolled: false,
  isVoted: false,
  question: '',
  answers: [],
};

const pollSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    setPollData: (
      state: InitialState,
      action: PayloadAction<{ question: string; answers: Answer[] }>
    ) => {
      state.isPolled = true;
      state.question = action.payload.question;
      state.answers = [...action.payload.answers];
    },
    hostOnlySetPollData: (
      state: InitialState,
      action: PayloadAction<{ question: string; answers: Answer[] }>
    ) => {
      state.question = action.payload.question;
      state.answers = action.payload.answers;
    },
    updatePollVotes: (state: InitialState, action: PayloadAction<string>) => {
      let index = state.answers.findIndex(
        (answer) => answer.option === action.payload
      );

      state.answers[index].votes++;
    },
    clearPollData: (state: InitialState) => {
      state.isPolled = false;
      state.isVoted = false;
      state.question = '';
      state.answers = [];
    },
    increment: (state: InitialState, action: PayloadAction<string>) => {
      let index = state.answers.findIndex(
        (answer) => answer.option === action.payload
      );
      state.answers[index].votes++;
    },
    voted: (state: InitialState) => {
      state.isVoted = true;
    },
  },
});

export const {
  setPollData,
  clearPollData,
  increment,
  voted,
  updatePollVotes,
  hostOnlySetPollData,
} = pollSlice.actions;

export default pollSlice.reducer;
