import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ChatMessage, ChatMessageSender } from "../screens/chat/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';
import { useGetAllChatMessagesQuery, useSendChatMessageMutation } from "../components/chat/chatApi";

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

  const { data: chatMessages, isFetching: isLoadingMessages } = useGetAllChatMessagesQuery(conversationId)
  const [sendMessage, { isLoading: isSendingMessage, isError: responseNotReceived, data}] = useSendChatMessageMutation()

  useEffect(() => {
    if (chatMessages) {
      const messages: ChatMessage[] = chatMessages.map((m) => {
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


  const addMessage = async (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    const response = await sendMessage({
      conversationId,
      message: message.content
    })
    if (responseNotReceived) {
      return
    }

    if (data) {
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
    } else {
      setMessages(prev => [...prev.slice(0, prev.length - 1)])
    }
  };


  return { messages, addMessage, isLoadingMessages, isSendingMessage, responseNotReceived };
};
