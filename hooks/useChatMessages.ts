import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ChatMessage } from "../types/Chat.types";

interface UseChatMessagesProps {
  syncWithBackend?: boolean;
}

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { syncWithBackend = true } = props;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsSyncing(true);

    const syncMessages = async () => {
      // TODO: If sync with backend is true, get messages from backend
      // and save them to SecureStore and set them to state

      const chatMessages = await SecureStore.getItemAsync("chatMessages");
      if (chatMessages === null || !chatMessages) {
        console.error("No chat messages found");
      } else {
        setMessages(JSON.parse(chatMessages) as ChatMessage[]);
      }
      setIsSyncing(false);
    };

    syncMessages();
  }, []);

  useEffect(() => {
    if (messages.length) {
      SecureStore.setItemAsync("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
    SecureStore.setItemAsync("chatMessages", JSON.stringify([]));
  };

  return { messages, addMessage, removeMessage, clearMessages, isSyncing };
};
