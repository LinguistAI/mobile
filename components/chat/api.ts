import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';

import { IMessageCountQuery, Message, MessageCount, TChatBot, TConversation } from './types';

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
  }),
});

export const {
  useCreateNewConversationMutation,
  useGetAllChatMessagesQuery,
  useGetAllConversationsQuery,
  useGetAvailableBotsQuery,
  useSendChatMessageMutation,
  useGetMessageCountByBotQuery,
} = chatApi;
