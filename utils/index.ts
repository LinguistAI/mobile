import * as SecureStore from "expo-secure-store";
import { LastMessageObject } from "../hooks/useChatMessages";

export const formatAsStr = (input: string | string[]): string => {
  if (Array.isArray(input)) {
    return input.join(', ');
  } else {
    return input;
  }
};

export const updateArrayAtIndex = (arr: any[], index: number, val: any) => {
  return [...arr.slice(0, index), val, ...arr.slice(index + 1)];
};

export const getLastMessages = async () => {
  const lastMessagesStr = await SecureStore.getItemAsync("lastMessages")
  if (!lastMessagesStr) return {}
  const lastMessages = JSON.parse(lastMessagesStr) as LastMessageObject
  return lastMessages
}
