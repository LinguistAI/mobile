import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveChatWalkthroughStarted = async () => {
  await AsyncStorage.setItem('chat-walkthrough-started', 'true');
};

export const getChatWalkthroughStarted = async () => {
  return await AsyncStorage.getItem('chat-walkthrough-started');
};
