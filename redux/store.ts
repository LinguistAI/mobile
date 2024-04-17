import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import { chatApi } from '../components/chat/api';
import { gamificationApi } from '../components/gamification/api';
import { wordBankApi } from '../components/word-bank/api';
import { userStatsApi } from '../components/stats/userStatsApi';
import { userApi } from '../components/user/userApi';
import {questsApi} from "../components/quest/api";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [gamificationApi.reducerPath]: gamificationApi.reducer,
    [wordBankApi.reducerPath]: wordBankApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [userStatsApi.reducerPath]: userStatsApi.reducer,
    [questsApi.reducerPath]: questsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(chatApi.middleware)
      .concat(gamificationApi.middleware)
      .concat(wordBankApi.middleware)
      .concat(userApi.middleware)
      .concat(userStatsApi.middleware)
      .concat(questsApi.middleware),
});
