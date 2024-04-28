import { useEffect, useState } from 'react';
import { ChatMessage, ChatMessageSender } from '../screens/chat/types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import {
  useGetPaginatedChatMessagesQuery,
  useLazyGetPaginatedChatMessagesQuery,
  useSendChatMessageMutation,
} from '../components/chat/api';
import { isDataResponse } from '../services';
import useNotifications from './useNotifications';

interface UseChatMessagesProps {
  conversationId: string;
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { conversationId, pageSize = DEFAULT_PAGE_SIZE } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const {
    data: initialMessages,
    isLoading: isLoadingInitialMessages,
    currentData,
  } = useGetPaginatedChatMessagesQuery({
    conversationId,
    params: { pageSize: DEFAULT_PAGE_SIZE },
  });
  const [trigger, { isFetching: isFetchingMore }] = useLazyGetPaginatedChatMessagesQuery();
  const [sendMessage, { isLoading: isSendingMessage, isError: responseNotReceived }] =
    useSendChatMessageMutation();
  const { add } = useNotifications();

  useEffect(() => {
    if (initialMessages) {
      const newMessageObjs: ChatMessage[] = initialMessages.content.map((m) => {
        return {
          content: m.messageText,
          sender: m.senderType,
          timestamp: m.createdDate,
          id: m.id,
        };
      });
      setMessages(newMessageObjs);
    }
  }, [initialMessages]);

  const addMessage = async (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    const response = await sendMessage({
      conversationId,
      message: message.content,
    });
    if (response?.data) {
      const responseMessage: ChatMessage = {
        content: response?.data,
        sender: ChatMessageSender.assistant,
        timestamp: new Date(),
        id: uuidv4(),
      };
      setMessages((prev) => [...prev, responseMessage]);
      return 1;
    }
    return -1;
  };

  const fetchEarlier = async (lastMessageId: string) => {
    const response = await trigger({ conversationId, params: { pageSize, lastMessageId } });
    if (!isDataResponse(response)) {
      add({
        body: 'Something went wrong while accessing earlier messages.',
        type: 'error',
      });
    }
    const newMessages = response.data;
    if (!newMessages) {
      add({
        body: 'Something went wrong while accessing earlier messages.',
        type: 'error',
      });
      return;
    }
    const newMessageObjs: ChatMessage[] = newMessages.content.map((m) => {
      return {
        content: m.messageText,
        sender: m.senderType,
        timestamp: m.createdDate,
        id: m.id,
      };
    });
    setMessages([...newMessageObjs, ...messages]);
  };

  return {
    messages,
    addMessage,
    isFetchingMore,
    isLoadingInitialMessages,
    isSendingMessage,
    responseNotReceived,
    fetchEarlier,
  };
};
