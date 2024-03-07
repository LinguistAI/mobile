import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosSecure, createAxiosBaseQuery } from '../../services'

import { Message, TChatBot, TConversation } from './types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/ml/conversation` }),
  tagTypes: ['Conversation', 'Message'],
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
        
      })
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
        data: { botId },
      }),
    }),
    sendChatMessage: builder.mutation<void, {conversationId: string, message: string}>({
      query: ({ conversationId, message }) => ({
        url: `/chat/send/${conversationId}`,
        method: 'POST',
        data: { message },
      }),
    }), 
  })
})

export const { 
  useCreateNewConversationMutation,
  useGetAllChatMessagesQuery,
  useGetAllConversationsQuery,
  useGetAvailableBotsQuery,
  useSendChatMessageMutation
 } = chatApi