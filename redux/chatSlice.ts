import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TWordList } from '../components/word-bank/word-list/types';
import { updateArrayAtIndex } from '../utils';
import { TChatBot, TConversation } from '../components/chat/types';

export interface ChatState {
  selectedBot: TChatBot | null;
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedBot: null
  } as ChatState,
  reducers: {
    startConversation: (state, action) => {
      state.selectedBot = action.payload.bot
    }
  },
});

export const {  startConversation } =
  chatSlice.actions;
export default chatSlice.reducer;
