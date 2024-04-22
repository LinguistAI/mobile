import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { RProfile } from './types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/ml/profile` }),
  endpoints: (builder) => ({
    getProfile: builder.query<RProfile, void>({
      query: () => ({
        method: 'GET',
        url: '/user',
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
} = profileApi;
