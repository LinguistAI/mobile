import { ChatState } from './chatSlice';

interface RootState {
  chat: ChatState;
}

export const selectCurrentBot = (state: RootState) => state.chat.currentConversation?.bot;
export const selectCurrentConversation = (state: RootState) => state.chat.currentConversation;
export const selectCurrentActiveWords = (state: RootState) => state.chat.currentConversation?.unknownWords;

// Modal selectors
export const selectIsQuestReminderModalOpen = (state: RootState) => state.chat.isQuestReminderModalOpen;
export const selectIsLevelUpModalOpen = (state: RootState) => state.chat.levelUpModalConfig.visible;
export const selectLevelUpModalConfig = (state: RootState) => state.chat.levelUpModalConfig;
