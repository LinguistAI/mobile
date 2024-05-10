import { ChatState } from './chatSlice';

interface RootState {
  chat: ChatState;
}

export const selectCurrentBot = (state: RootState) => state.chat.currentConversation?.bot;
export const selectCurrentConversation = (state: RootState) => state.chat.currentConversation;
export const selectCurrentActiveWords = (state: RootState) => state.chat.currentConversation?.unknownWords;
