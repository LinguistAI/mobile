import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { QFriendRequest, IUserDetailedInfo, RFriendship, QUserSearch } from './types';
import { Page, User } from '../../types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  tagTypes: ['User', 'FriendRequest', 'Friend'],
  endpoints: (builder) => ({
    setUserDetails: builder.mutation<void, IUserDetailedInfo>({
      query: (userAnswers) => ({
        url: '/profile',
        method: 'PUT',
        body: userAnswers,
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails: builder.query<IUserDetailedInfo, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    searchUser: builder.query<Page<User>, QUserSearch>({
      query: (searchParams) => ({
        url: '/profile/search',
        method: 'GET',
        params: searchParams,
      }),
    }),
    getFriendRequests: builder.query<RFriendship[], void>({
      query: () => ({
        url: '/friend/request',
        method: 'GET',
      }),
      providesTags: ['FriendRequest'],
    }),
    getFriends: builder.query<RFriendship[], void>({
      query: () => ({
        url: '/friend',
        method: 'GET',
      }),
      providesTags: ['Friend'],
    }),
    removeFriend: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend',
        method: 'DELETE',
        body: friendReq,
      }),
      invalidatesTags: ['Friend'],
    }),
    sendFriendRequest: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend/request',
        body: friendReq,
        method: 'POST',
      }),
    }),
    acceptFriendRequest: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend/request/accept',
        method: 'POST',
        body: friendReq,
      }),
      invalidatesTags: ['FriendRequest', 'Friend'],
    }),
    rejectFriendRequest: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend/request/accept',
        method: 'POST',
        body: friendReq,
      }),
      invalidatesTags: ['FriendRequest'],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useSetUserDetailsMutation,
  useAcceptFriendRequestMutation,
  useGetFriendRequestsQuery,
  useGetFriendsQuery,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
  useLazySearchUserQuery,
} = userApi;
