import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import { chatApi } from '../components/chat/chatApi';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
});
