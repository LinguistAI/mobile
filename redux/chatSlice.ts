import { createSlice } from '@reduxjs/toolkit';

import { chatApi } from '../components/chat/api';
import { TChatBot, TConversation } from '../components/chat/types';
import { gamificationApi } from '../components/gamification/api';
import { userApi } from '../components/user/userApi';
import { wordBankApi } from '../components/word-bank/api';
import { set } from 'date-fns';

export interface ChatState {
  selectedBot: TChatBot | null;
  currentConversation: TConversation | null;
  isQuestReminderModalOpen: boolean;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedBot: null,
    currentConversation: null,
    isQuestReminderModalOpen: false,
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
    setQuestReminderModalOpen: (state, action) => {
      state.isQuestReminderModalOpen = action.payload;
    },
  },
});

export const {
  startConversation,
  resetApiState,
  clearMessages,
  updateSelectedConversation,
  setQuestReminderModalOpen,
} = chatSlice.actions;
export default chatSlice.reducer;
