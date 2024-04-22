import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLastMessage = async (conversationId: string, message: string, date: Date) => {
  try {
    const existingMessagesJson = await AsyncStorage.getItem('conversationMessages');
    const existingMessages = existingMessagesJson ? JSON.parse(existingMessagesJson) : {};

    existingMessages[conversationId] = { msg: message, timestamp: date.toISOString() };

    await AsyncStorage.setItem('conversationMessages', JSON.stringify(existingMessages));
  } catch (error) {
    console.error('Error saving last message:', error);
  }
};

export const getLastMessages = async () => {
  try {
    const conversationMessagesJson = await AsyncStorage.getItem('conversationMessages');
    const conversationMessages = conversationMessagesJson ? JSON.parse(conversationMessagesJson) : {};
    return conversationMessages;
  } catch (error) {
    console.error('Error getting last message:', error);
    return null;
  }
};

export const getLastMessage = (messages: { [key: string]: string }, conversationId: string) => {
  return messages[conversationId] || '';
};

export const clearLastMessages = async (conversationId: string) => {
  try {
    const existingMessagesJson = await AsyncStorage.getItem('conversationMessages');
    const existingMessages = existingMessagesJson ? JSON.parse(existingMessagesJson) : {};

    delete existingMessages[conversationId];

    await AsyncStorage.setItem('conversationMessages', JSON.stringify(existingMessages));
  } catch (error) {
    console.error('Error clearing last message:', error);
  }
};
