import { ChatState } from './chatSlice';

interface RootState {
  chat: ChatState;
}

export const selectCurrentBot = (state: RootState) => state.chat.selectedBot