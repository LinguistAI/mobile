import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ChatMessage } from "../screens/chat/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllChatMessages, sendChatMessage } from "../components/chat/Chat.service";

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
      
    },
    onError: (error) => {
      setMessages(prev => [...prev.slice(0, prev.length - 1)])
    }
  })

  useEffect(() => {
    setMessages(chatMessages.data)
  }, [chatMessages])

  useEffect(() => {
    if (messages.length) {
      SecureStore.setItemAsync(`chatMessages::${conversationId}`, JSON.stringify(messages));
    }
  }, [messages]);


  const addMessage = (message: ChatMessage) => {
    sendMessage(message)
    setMessages((prev) => [...prev, message]); // optimistic update
  };

  const clearMessages = () => {
    // TODO: Send request to BE
    setMessages([]);
    SecureStore.setItemAsync(`chatMessages::${conversationId}s`, JSON.stringify([]));
  };

  return { messages, addMessage, clearMessages, isLoadingMessages, isSendingMessage, responseNotReceived };
};
