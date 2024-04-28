import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';

import {
  IMessageCountQuery,
  Message,
  MessageCount,
  QPaginatedMessage,
  TChatBot,
  TConversation,
} from './types';
import { Page } from '../../types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/ml/conversation` }),
  tagTypes: ['Conversation', 'Message', 'Stat'],
  endpoints: (builder) => ({
    getAvailableBots: builder.query<TChatBot[], void>({
      query: () => ({
        method: 'GET',
        url: '/bots',
      }),
    }),
    getAllConversations: builder.query<TConversation[], void>({
      query: () => ({
        method: 'GET',
        url: '/user',
      }),
      providesTags: ['Conversation'],
    }),
    getAllChatMessages: builder.query<Message[], string>({
      query: (conversationId: string) => ({
        method: 'GET',
        url: `/chat/all/${conversationId}`,
      }),
      providesTags: (result, error, conversationId) => [{ type: 'Message', id: conversationId }],
      keepUnusedDataFor: 0,
    }),
    getPaginatedChatMessages: builder.query<
      Page<Message>,
      { conversationId: string; params: QPaginatedMessage }
    >({
      query: ({ conversationId, params }) => ({
        method: 'GET',
        url: `/chat/messages/${conversationId}`,
        params,
      }),
    }),
    createNewConversation: builder.mutation<TConversation, string>({
      query: (botId: string) => ({
        url: '/create',
        method: 'POST',
        body: { botId },
      }),
      invalidatesTags: ['Conversation'],
    }),
    sendChatMessage: builder.mutation<
      { data: string; timestamp: Date },
      { conversationId: string; message: string }
    >({
      query: ({ conversationId, message }) => ({
        url: `/chat/send/${conversationId}`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: ['Stat'],
    }),
    getMessageCountByBot: builder.query<MessageCount[], IMessageCountQuery>({
      query: (messageQuery: IMessageCountQuery) => ({
        url: `/chat/count`,
        method: 'GET',
        params: messageQuery,
      }),
      providesTags: ['Stat'],
    }),
    clearConversation: builder.mutation<TConversation, string>({
      query: (convoId) => ({
        url: `/clear/${convoId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, _, convoId) => [{ type: 'Message', id: convoId }, { type: 'Conversation' }],
    }),
  }),
});

export const {
  useCreateNewConversationMutation,
  useGetAllChatMessagesQuery,
  useGetAllConversationsQuery,
  useGetAvailableBotsQuery,
  useSendChatMessageMutation,
  useGetMessageCountByBotQuery,
  useClearConversationMutation,
  useLazyGetPaginatedChatMessagesQuery,
  useGetPaginatedChatMessagesQuery,
} = chatApi;
