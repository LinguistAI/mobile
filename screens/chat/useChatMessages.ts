import { useEffect, useMemo, useState } from 'react';
import { ChatMessage, ChatMessageSender } from './types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { useGetPaginatedChatMessagesQuery, useSendChatMessageMutation } from '../../components/chat/api';
import { Message } from '../../components/chat/types';
import { INITIAL_PAGE, DEFAULT_PAGE_SIZE } from './constants';

interface UseChatMessagesProps {
  conversationId: string;
  page?: number;
  pageSize?: number;
}

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { conversationId, page, pageSize } = props;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const currentPage = page || INITIAL_PAGE;
  const currentPageSize = pageSize || DEFAULT_PAGE_SIZE;

  const [sendMessage, { isLoading: isSendingMessage, isError: responseNotReceived, data }] =
    useSendChatMessageMutation();
  const currentResult = useGetPaginatedChatMessagesQuery({
    conversationId,
    params: { page: currentPage, pageSize: currentPageSize },
  });
  useEffect(() => {
    if (!currentResult.data) return;

    const chatMessages: ChatMessage[] = currentResult?.data.content
      .map((c) => ({
        content: c.messageText,
        sender: c.senderType,
        timestamp: c.createdDate,
        id: c.id,
      }))
      .filter((c) => c);
    const merged = [...messages, ...chatMessages];
    setMessages(merged);
  }, [currentResult.data]);

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

  const isLoadingMessages = currentResult.isLoading;

  return { messages, isLoadingMessages, addMessage, isSendingMessage, responseNotReceived };
};
