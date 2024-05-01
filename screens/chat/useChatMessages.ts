import { useMemo, useState } from 'react';
import { ChatMessage, ChatMessageSender } from './types';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { useGetPaginatedChatMessagesQuery, useSendChatMessageMutation } from '../../components/chat/api';
import { INITIAL_PAGE, DEFAULT_PAGE_SIZE } from './constants';

interface UseChatMessagesProps {
  conversationId: string;
  page?: number;
  pageSize?: number;
}

export const useChatMessages = (props: UseChatMessagesProps) => {
  const { conversationId, page, pageSize } = props;
  const currentPage = page || INITIAL_PAGE;
  const currentPageSize = pageSize || DEFAULT_PAGE_SIZE;
  const [previousMessages, setPreviousMessages] = useState<ChatMessage[]>([]);
  const [addedMessages, setAddedMessages] = useState<ChatMessage[]>([]);

  const [sendMessage, { isLoading: isSendingMessage, isError: responseNotReceived }] =
    useSendChatMessageMutation();
  const currentResult = useGetPaginatedChatMessagesQuery({
    conversationId,
    params: { page: currentPage, pageSize: currentPageSize },
  });

  useMemo(() => {
    if (!currentResult.data || currentPage > currentResult.data.totalPages) return;
    const chatMessages: ChatMessage[] = currentResult?.data.content
      .map((c) => ({
        content: c.messageText,
        sender: c.senderType,
        timestamp: c.createdDate,
        id: c.id,
      }))
      .reverse()
      .filter((c) => c);

    setPreviousMessages((prev) => [...chatMessages, ...prev]);
    return chatMessages;
  }, [currentResult.data]);

  const addMessage = async (message: ChatMessage) => {
    setAddedMessages((prev) => [...prev, message]);
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
      setAddedMessages((prev) => [...prev, responseMessage]);
      return 1;
    }
    return -1;
  };

  const isLoadingMessages = currentResult.isFetching;
  const isFirstPage = currentResult.data?.first;
  const isLastPage = currentResult.data?.last;
  const hasMoreMessages = useMemo(() => !isLastPage, [isLastPage]);
  const messages = useMemo(() => [...previousMessages, ...addedMessages], [previousMessages, addedMessages]);

  return {
    messages,
    isLoadingMessages,
    addMessage,
    isSendingMessage,
    responseNotReceived,
    hasMoreMessages,
    isFirstPage,
    addedMessages: [...addedMessages],
  };
};
