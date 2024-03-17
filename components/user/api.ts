import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { IUserDetailedInfo } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/` }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    setUserDetails: builder.mutation<void, IUserDetailedInfo>({
      query: (userAnswers) => ({
        url: 'profile',
        method: 'PUT',
        data: userAnswers,
        secure: false,
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails: builder.query<IUserDetailedInfo, void>({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserDetailsQuery, useSetUserDetailsMutation } = userApi;
