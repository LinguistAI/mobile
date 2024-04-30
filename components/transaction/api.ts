import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { RUserGems } from './types';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  endpoints: (builder) => ({
    getTransaction: builder.query<RUserGems, void>({
      query: () => ({
        url: '/transaction',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetTransactionQuery } = transactionApi;
