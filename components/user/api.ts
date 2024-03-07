import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { IUserAnswers } from './types';

export const userAPi = createApi({
  reducerPath: 'userApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/profile` }),
  endpoints: (builder) => ({
    setUserDetails: builder.mutation<void, IUserAnswers>({
      query: (userAnswers) => ({
        url: '/',
        method: 'PUT',
        data: userAnswers,
        secure: false,
      }),
    }),
    getUserDetails: builder.query<IUserAnswers, void>({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery, useSetUserDetailsMutation } = userAPi;
