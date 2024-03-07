import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import { chatApi } from '../components/chat/chatApi';
import { gamificationApi } from '../components/gamification/gamificationApi';
import { wordBankApi } from '../components/word-bank/wordBankApi';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [gamificationApi.reducerPath]: gamificationApi.reducer,
    [wordBankApi.reducerPath]: wordBankApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware).concat(gamificationApi.middleware).concat(wordBankApi.middleware),
});
