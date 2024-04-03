import { useEffect, useState } from 'react';
import { ChatMessage, ChatMessageSender } from '../screens/chat/types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { useGetAllChatMessagesQuery, useSendChatMessageMutation } from '../components/chat/api';

interface UseChatMessagesProps {
  conversationId: string;
}

export type LastMessageObject = {
  [key: string]: {
    timestamp: Date;
    msg: string;
  };
};

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { conversationId } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { data: chatMessages, isFetching: isLoadingMessages } = useGetAllChatMessagesQuery(conversationId);
  const [sendMessage, { isLoading: isSendingMessage, isError: responseNotReceived, data }] =
    useSendChatMessageMutation();

  useEffect(() => {
    if (chatMessages) {
      const messages: ChatMessage[] = chatMessages.map((m) => {
        return {
          id: m.id,
          content: m.messageText,
          sender: m.senderType,
          timestamp: m.createdDate,
        };
      });
      setMessages(messages);
    }
  }, [chatMessages]);

  const addMessage = async (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    const response = await sendMessage({
      conversationId,
      message: message.content,
    });
    if (responseNotReceived) {
      setMessages((prev) => [...prev.slice(0, prev.length - 1)]);
      return;
    }
    console.log(response);
    if (response?.data) {
      const responseMessage: ChatMessage = {
        content: response?.data,
        sender: ChatMessageSender.assistant,
        timestamp: new Date(),
        id: uuidv4(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }
  };

  return { messages, addMessage, isLoadingMessages, isSendingMessage, responseNotReceived };
};
