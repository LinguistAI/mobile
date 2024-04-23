import { createSlice } from '@reduxjs/toolkit';

import { chatApi } from '../components/chat/api';
import { TChatBot, TConversation } from '../components/chat/types';
import { gamificationApi } from '../components/gamification/api';
import { userApi } from '../components/user/userApi';
import { wordBankApi } from '../components/word-bank/api';

export interface ChatState {
  selectedBot: TChatBot | null;
  currentConversation: TConversation | null;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedBot: null,
    currentConversation: null,
  } as ChatState,
  reducers: {
    startConversation: (state, action) => {
      state.selectedBot = action.payload.bot;
      state.currentConversation = action.payload.conversation;
    },
    resetApiState: (state, action) => {
      chatApi.util.resetApiState();
      gamificationApi.util.resetApiState();
      wordBankApi.util.resetApiState();
      userApi.util.resetApiState();
    },
    clearMessages: (state, action) => {
      chatApi.util.invalidateTags([{ type: 'Message', id: action.payload.id }]);
    },
    updateSelectedConversation: (state, action) => {
      state.currentConversation = action.payload.conversation;
    },
  },
});

export const { startConversation, resetApiState, clearMessages, updateSelectedConversation } =
  chatSlice.actions;
export default chatSlice.reducer;
