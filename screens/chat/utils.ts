import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFirstChatWalkthroughStarted = async () => {
  await AsyncStorage.setItem('first-walkthrough-started', 'true');
};

export const getFirstChatWalthroughStarted = async () => {
  return await AsyncStorage.getItem('first-walkthrough-started');
};

export const saveSecondChatWalkthroughStarted = async () => {
  await AsyncStorage.setItem('second-walkthrough-started', 'true');
};

export const getSecondChatWalkthroughStarted = async () => {
  return await AsyncStorage.getItem('second-walkthrough-started');
};
