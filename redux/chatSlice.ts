import { createSlice } from '@reduxjs/toolkit';

import { chatApi } from '../components/chat/api';
import { TChatBot } from '../components/chat/types';
import { gamificationApi } from '../components/gamification/api';
import { userApi } from '../components/user/userApi';
import { wordBankApi } from '../components/word-bank/api';

export interface ChatState {
  selectedBot: TChatBot | null;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedBot: null,
  } as ChatState,
  reducers: {
    startConversation: (state, action) => {
      state.selectedBot = action.payload.bot;
    },
    resetApiState: (state, action) => {
      chatApi.util.resetApiState();
      gamificationApi.util.resetApiState();
      wordBankApi.util.resetApiState();
      userApi.util.resetApiState();
    },
  },
});

export const { startConversation, resetApiState } = chatSlice.actions;
export default chatSlice.reducer;
