import { createSlice } from '@reduxjs/toolkit';

import { TChatBot } from '../components/chat/types';

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
  },
});

export const { startConversation } = chatSlice.actions;
export default chatSlice.reducer;
