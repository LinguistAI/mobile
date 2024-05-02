import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';

import {
  IMessageCountQuery,
  Message,
  MessageCount,
  QGetSpeech,
  QSynthesizeSpeech,
  RSynthesizeSpeech,
  TChatBot,
  TConversation,
} from './types';
import axios from 'axios';

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
    getConversation: builder.query<TConversation, string | undefined>({
      query: (convoId) => ({
        method: 'GET',
        url: `/user/${convoId}`,
      }),
      keepUnusedDataFor: 0,
      providesTags: (result, error, arg) => [{ type: 'Conversation', id: arg }],
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
    getSpeech: builder.query<RSynthesizeSpeech, QSynthesizeSpeech>({
      queryFn: async (args) => {
        try {
          const response = await axios.get(
            'https://fzcdr4nq9b.execute-api.eu-central-1.amazonaws.com/testing/polly',
            { headers: { 'Content-Type': 'application/json' }, params: args }
          );
          const data = response.data;
          return {
            data,
          };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: JSON.stringify(error),
              msg: 'Failed to get speech',
            },
          };
        }
      },
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
  useGetConversationQuery,
  useLazyGetSpeechQuery,
} = chatApi;
