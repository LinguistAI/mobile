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

export type LastMessageObject = {
  [key: string]: {
    timestamp: Date
    msg: string
  }
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
    
      const messages: ChatMessage[] = chatMessages.data.map((m) => {
        return {
          id: m.id,
          content: m.messageText,
          sender: m.senderType,
          timestamp: m.createdDate
        }
      })
      setMessages(messages)
    }
  }, [chatMessages])


  const addMessage = (message: ChatMessage) => {
    sendMessage(message)
    setMessages((prev) => [...prev, message]);
  };


  return { messages, addMessage, isLoadingMessages, isSendingMessage, responseNotReceived };
};
