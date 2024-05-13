import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';

import {
  IMessageCountQuery,
  Message,
  MessageCount,
  QMessages,
  QTranscribe,
  RTranscribeMsg,
  RTranscribeResult,
  TChatBot,
  TConversation,
} from './types';
import { Page } from '../../types';
import { ChatMessage } from '../../screens/chat/types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/ml/conversation` }),
  tagTypes: ['Conversations', 'Message', 'Stat'],
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
      providesTags: (result, error, arg) => [{ type: 'Conversations', id: arg }],
    }),
    getAllConversations: builder.query<TConversation[], void>({
      query: () => ({
        method: 'GET',
        url: '/user',
      }),
      providesTags: ['Conversations'],
    }),
    getAllChatMessages: builder.query<Message[], string>({
      query: (conversationId: string) => ({
        method: 'GET',
        url: `/chat/all/${conversationId}`,
      }),
      providesTags: (result, error, conversationId) => [{ type: 'Message', id: conversationId }],
      keepUnusedDataFor: 0,
    }),
    getPaginatedChatMessages: builder.query<Page<Message>, QMessages>({
      query: (args) => ({
        method: 'GET',
        url: `/chat/messages/${args.conversationId}`,
        params: args.params,
      }),
      providesTags: (result, error, args) => [
        { type: 'Message', id: `${args.conversationId}-${args.params.page}-${args.params.pageSize}}` },
      ],
    }),
    createNewConversation: builder.mutation<TConversation, string>({
      query: (botId: string) => ({
        url: '/create',
        method: 'POST',
        body: { botId },
      }),
      invalidatesTags: ['Conversations'],
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
      invalidatesTags: (result, _, convoId) => [{ type: 'Message', id: convoId }, { type: 'Conversations' }],
    }),
    sendTranscriptionRequest: builder.mutation<RTranscribeMsg, { key: QTranscribe; audio: any }>({
      queryFn: async (args) => {
        try {
          const response = await axiosSecure.post(
            '/aws/transcribe',
            { audio: args.audio },
            {
              params: args.key,
              headers: {
                'Content-Type': 'application/json',
              },
            }
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
              msg: 'Failed to start transcribe request',
            },
          };
        }
      },
    }),
    getTranscriptionResult: builder.query<RTranscribeResult, { jobName: string }>({
      queryFn: async (args) => {
        try {
          const response = await axiosSecure.get('/aws/transcribe', {
            params: args,
          });
          const data = response.data;
          return {
            data,
          };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: JSON.stringify(error),
              msg: 'Failed to retrieve transcribe result',
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
  useGetPaginatedChatMessagesQuery,
  useSendTranscriptionRequestMutation,
  useLazyGetTranscriptionResultQuery,
} = chatApi;
