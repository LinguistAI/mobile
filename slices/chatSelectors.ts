import { ChatState } from './chatSlice';

interface RootState {
  chat: ChatState;
}

const chat = (state: RootState) => {
  console.log(state);
};

export const selectFilteredWordLists = (state: RootState) => state.chat.filteredWordLists;
export const selectWordLists = (state: RootState) => state.chat.wordLists;
export const selectAreWordListsFetched = (state: RootState) => state.chat.fetchedWordLists;
