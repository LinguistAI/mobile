import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { IProfile } from './types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/ml/profile` }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<IProfile, void>({
      query: () => ({
        method: 'GET',
        url: '/user',
      }),
      providesTags: ['Profile'],
    }),
    setProfile: builder.mutation<void, IProfile>({
      query: (profile) => ({
        url: '/update',
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useSetProfileMutation
} = profileApi;
