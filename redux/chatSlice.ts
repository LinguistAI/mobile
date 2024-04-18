import { createSlice } from '@reduxjs/toolkit';

import { TChatBot } from '../components/chat/types';

export interface ChatState {
  selectedBot: TChatBot | null;
  currentConversation: string | null;
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
  },
});

export const { startConversation } = chatSlice.actions;
export default chatSlice.reducer;
