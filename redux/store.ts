import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import { chatApi } from '../components/chat/api';
import { gamificationApi } from '../components/gamification/api';
import { wordBankApi } from '../components/word-bank/api';
import { userApi } from '../components/user/api';
import { quizApi } from '../components/quiz/quizApi';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [gamificationApi.reducerPath]: gamificationApi.reducer,
    [wordBankApi.reducerPath]: wordBankApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(chatApi.middleware)
      .concat(gamificationApi.middleware)
      .concat(wordBankApi.middleware)
      .concat(userApi.middleware)
      .concat(quizApi.middleware),
});
