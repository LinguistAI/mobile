import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { IUserExperience, IUserStreak } from './types';

export const gamificationApi = createApi({
  reducerPath: 'gamificationApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  endpoints: (builder) => ({
    getUserStreak: builder.query<IUserStreak, void>({
      query: () => ({
        url: '/user-streak',
        method: 'GET',
      }),
    }),
    getUserExperience: builder.query<IUserExperience, void>({
      query: () => ({
        url: '/user-xp',
        method: 'GET',
      }),
      keepUnusedDataFor: 1,
    }),
  }),
});

export const { useGetUserStreakQuery, useGetUserExperienceQuery } = gamificationApi;
