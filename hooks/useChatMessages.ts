import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ChatMessage, ChatMessageSender } from "../screens/chat/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllChatMessages, sendChatMessage } from "../components/chat/Chat.service";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';

interface UseChatMessagesProps {
  conversationId: string;
}

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { conversationId } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { data: chatMessages, isPending: isLoadingMessages } = useQuery({
    queryKey: ["getAllChatMessages", conversationId],
    queryFn: () => getAllChatMessages(conversationId),
  })

  const { mutate: sendMessage, isPending: isSendingMessage, isError: responseNotReceived } = useMutation({
    mutationFn: (message: ChatMessage) => sendChatMessage(conversationId, message.content),
    onSuccess: (data) => {
      const message: ChatMessage = {
        content: data.data,
        sender: ChatMessageSender.assistant,
        timestamp: data.timestamp,
        id: uuidv4()
      }
      setMessages(prev => [
        ...prev,
        message
      ])
    },
    onError: (error) => {
      setMessages(prev => [...prev.slice(0, prev.length - 1)])
    }
  })

  useEffect(() => {
    if (chatMessages?.data) {
      setMessages(chatMessages?.data)
    }
  }, [chatMessages])

  useEffect(() => {
    if (messages.length) {
      SecureStore.setItemAsync(`chatMessages::${conversationId.replace("-", "")}`, JSON.stringify(messages));
    }
  }, [messages]);


  const addMessage = (message: ChatMessage) => {
    sendMessage(message)
    setMessages((prev) => [...prev, message]); // optimistic update
  };

  const clearMessages = () => {
    // TODO: Send request to BE
    setMessages([]);
    SecureStore.setItemAsync(`chatMessages::${conversationId.replace("-", "")}s`, JSON.stringify([]));
  };

  return { messages, addMessage, clearMessages, isLoadingMessages, isSendingMessage, responseNotReceived };
};
