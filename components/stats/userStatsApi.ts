import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { QFriendStats } from '../user/types';
import { QLoggedDate, RLoggedDate, RWordLearning } from './types';

export const userStatsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  invalidationBehavior: 'immediately',
  keepUnusedDataFor: 3,
  endpoints: (builder) => ({
    getLoggedDates: builder.query<RLoggedDate, QLoggedDate>({
      query: (statParams) => ({
        method: 'GET',
        url: '/stats/logged-date',
        params: statParams,
      }),
    }),
    getLoggedDatesForUser: builder.query<RLoggedDate, { userId: string; statParams: QLoggedDate }>({
      query: ({ userId, statParams }) => ({
        method: 'GET',
        url: `/stats/logged-date/${userId}`,
        params: statParams,
      }),
    }),
    getWordLearningStats: builder.query<RWordLearning, void>({
      query: () => ({
        method: 'GET',
        url: '/wordbank/lists/stats',
      }),
    }),
    getWordLearningStatsForUser: builder.query<RWordLearning, string>({
      query: (userId: string) => ({
        method: 'GET',
        url: `/wordbank/lists/stats/${userId}`,
      }),
    }),
  }),
});

export const {
  useGetLoggedDatesQuery,
  useGetLoggedDatesForUserQuery,
  useGetWordLearningStatsQuery,
  useGetWordLearningStatsForUserQuery,
} = userStatsApi;
