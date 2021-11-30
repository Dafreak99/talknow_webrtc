import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import messageSlice from '../features/message/messageSlice';
import pollSlice from '../features/poll/pollSlice';
import roomSlice from '../features/room/roomSlice';
import streamSlice from '../features/stream/streamSlice';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: {
    stream: streamSlice,
    message: messageSlice,
    room: roomSlice,
    poll: pollSlice,
  },
  middleware: customizedMiddleware,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
