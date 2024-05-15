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
  QProfile,
  RProfile,
  FriendProfile, RProfilePicture, QProfilePicture, QUserLanguage,
} from './types';
import { Page, User } from '../../types';
import { RUserQuests } from '../quest/types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  tagTypes: ['User', 'FriendRequest', 'Friend', 'Profile', 'FriendProfileInfo', 'UserLanguage'],
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
      invalidatesTags: (result, error, request) => [
        'Friend',
        { type: 'FriendProfileInfo', id: request.friendId },
      ],
    }),
    sendFriendRequest: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend/request',
        body: friendReq,
        method: 'POST',
      }),
      invalidatesTags: (result, error, request) => [
        'FriendRequest',
        { type: 'FriendProfileInfo', id: request.friendId },
      ],
    }),
    acceptFriendRequest: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend/request/accept',
        method: 'POST',
        body: friendReq,
      }),
      invalidatesTags: (result, error, request) => [
        'FriendRequest',
        'Friend',
        { type: 'FriendProfileInfo', id: request.friendId },
      ],
    }),
    rejectFriendRequest: builder.mutation<void, QFriendRequest>({
      query: (friendReq) => ({
        url: '/friend/request/reject',
        method: 'POST',
        body: friendReq,
      }),
      invalidatesTags: (result, error, request) => [
        'FriendRequest',
        { type: 'FriendProfileInfo', id: request.friendId },
      ],
    }),
    getGlobalLeaderboard: builder.query<RLeaderboard, QLeaderboard>({
      query: (paginationParams) => ({
        url: '/leaderboard/global/xp',
        method: 'GET',
        params: paginationParams,
      }),
      keepUnusedDataFor: 0,
    }),
    getFriendLeaderboard: builder.query<RLeaderboard, QLeaderboard>({
      query: (paginationParams) => ({
        url: '/leaderboard/friends/xp',
        method: 'GET',
        params: paginationParams,
      }),
      keepUnusedDataFor: 0,
    }),
    getProfile: builder.query<RProfile, void>({
      query: () => ({
        method: 'GET',
        url: '/ml/profile/user',
      }),
      providesTags: ['Profile'],
    }),
    setProfile: builder.mutation<void, QProfile>({
      query: (profile) => ({
        url: '/ml/profile/update-ml',
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['Profile'],
    }),
    getFriendProfile: builder.query<FriendProfile, string>({
      query: (userId: string) => ({
        method: 'GET',
        url: `/profile/${userId}`,
      }),
      providesTags: (result, error, userId) => [{ type: 'FriendProfileInfo', id: userId }],
      keepUnusedDataFor: 0,
    }),
    getProfilePicture: builder.query<RProfilePicture, string>({
      query: (username: string) => ({
        method: 'GET',
        url: `/aws/picture?key=${username}.jpeg`,
      }),
      keepUnusedDataFor: 0,
    }),
    setProfilePicture: builder.mutation<void, QProfilePicture>({
      query: ({ username, picture }) => ({
        url: `/aws/picture?key=${username}.jpeg`,
        method: 'POST',
        body: picture,
      }),
    }),
    setUserLanguage: builder.mutation<void, QUserLanguage>({
      query: ({ language }) => ({
        url: `/auth/language/${language}`,
        method: 'POST',
      }),
      invalidatesTags: ['UserLanguage'],
    }),
    getUserLanguage: builder.query<void, QUserLanguage>({
      query: () => ({
        url: '/auth/language',
        method: 'GET',
      }),
      providesTags: ['UserLanguage'],
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
  useGetProfileQuery,
  useSetProfileMutation,
  useGetFriendProfileQuery,
  useGetProfilePictureQuery,
  useSetProfilePictureMutation,
  useSetUserLanguageMutation,
  useGetUserLanguageQuery,
} = userApi;
