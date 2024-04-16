import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { QLoggedDate, RLoggedDate, RWordLearning } from './types';

export const userStatsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  endpoints: (builder) => ({
    getLoggedDates: builder.query<RLoggedDate, QLoggedDate>({
      query: (statParams) => ({
        method: 'GET',
        url: '/stats/logged-date',
        params: statParams,
      }),
    }),
    getWordLearningStats: builder.query<RWordLearning, void>({
      query: () => ({
        method: 'GET',
        url: '/wordbank/lists/stats',
      }),
    }),
  }),
});

export const { useGetLoggedDatesQuery, useGetWordLearningStatsQuery } = userStatsApi;
