import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ChatMessage } from "../screens/chat/types";

interface UseChatMessagesProps {
  syncWithBackend?: boolean;
}

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { syncWithBackend = false } = props;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsSyncing(true);

    const syncMessages = async () => {
      const chatMessages = await SecureStore.getItemAsync("chatMessages");
      if (chatMessages) {
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

  const getMessages = async () => {
    return;
  };

  return { messages, addMessage, removeMessage, clearMessages, isSyncing };
};
