import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TWordList } from '../components/word-bank/word-list/types';
import { updateArrayAtIndex } from '../utils';

export interface ChatState {
  fetchedWordLists: boolean;
  wordLists: TWordList[];
  filteredWordLists: TWordList[];
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    wordLists: [],
    filteredWordLists: [],
    fetchedWordLists: false,
  } as ChatState,
  reducers: {
    wordListsFiltered: (state, action) => {
      state.filteredWordLists = action.payload;
    },
    wordListUpdated: (state, action: PayloadAction<{ targetList: TWordList }>) => {
      const { targetList: updatedList } = action.payload;
      const listIndex = state.wordLists.findIndex((list) => list.listId === updatedList.listId);
      const filteredListIndex = state.filteredWordLists.findIndex(
        (list) => list.listId === updatedList.listId
      );

      state.wordLists = updateArrayAtIndex(state.wordLists, listIndex, updatedList);
      if (filteredListIndex !== -1) {
        state.filteredWordLists = updateArrayAtIndex(
          state.wordLists,
          filteredListIndex,
          updatedList
        );
      }
    },
    wordListDeleted: (state, action: PayloadAction<{ targetListId: string }>) => {
      const { targetListId } = action.payload;
      state.wordLists = state.wordLists.filter((list) => list.listId !== targetListId);
      state.filteredWordLists = state.filteredWordLists.filter(
        (list) => list.listId !== targetListId
      );
    },
    wordListsInitialized: (state, action) => {
      state.wordLists = action.payload;
      state.filteredWordLists = action.payload;
      state.fetchedWordLists = true;
    },
  },
});

export const { wordListsFiltered, wordListsInitialized, wordListUpdated, wordListDeleted } =
  chatSlice.actions;
export default chatSlice.reducer;
