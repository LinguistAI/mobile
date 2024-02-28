import { ChatState } from './chatSlice';

interface RootState {
  chat: ChatState;
}

export const selectFilteredWordLists = (state: RootState) => state.chat.filteredWordLists;
export const selectWordLists = (state: RootState) => state.chat.wordLists;
export const selectAreWordListsFetched = (state: RootState) => state.chat.fetchedWordLists;
export const selectConversations = (state: RootState) => state.chat.conversations;
export const selectCurrentBot = (state: RootState) => state.chat.selectedBot