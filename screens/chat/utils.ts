import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveChatWalkthroughStarted = async () => {
  await AsyncStorage.setItem('walkthrough-started', 'true');
};

export const getChatWalkthroughStarted = async () => {
  return await AsyncStorage.getItem('walthrough-started');
};
