import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import {
  QFriendRequest,
  IUserDetailedInfo,
  RFriendship,
  QUserSearch,
  RFriendRequest,
  RFriendSearch,
  QLeaderboard,
  RLeaderboard,
} from './types';
import { Page, User } from '../../types';
import {RUserQuests} from "../quest/types";

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
    searchUser: builder.query<Page<RFriendSearch>, QUserSearch>({
      query: (searchParams) => ({
        url: '/profile/search',
        method: 'GET',
        params: searchParams,
      }),
    }),
    getFriendRequests: builder.query<RFriendRequest[], void>({
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
      invalidatesTags: ['FriendRequest'],
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
    getGlobalLeaderboard: builder.query<RLeaderboard, QLeaderboard>({
      query: (paginationParams) => ({
        url: '/leaderboard/global/xp',
        method: 'GET',
        params: paginationParams,
      }),
    }),
    getFriendLeaderboard: builder.query<RLeaderboard, QLeaderboard>({
      query: (paginationParams) => ({
        url: '/leaderboard/friends/xp',
        method: 'GET',
        params: paginationParams,
      }),
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
  useLazyGetGlobalLeaderboardQuery,
  useLazyGetFriendLeaderboardQuery,
} = userApi;
