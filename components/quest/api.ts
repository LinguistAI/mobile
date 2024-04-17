import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import {RUserQuests} from './types';

export const questsApi = createApi({
  reducerPath: 'questsApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
  endpoints: (builder) => ({
    getQuests: builder.query<RUserQuests[], void>({
      query: () => ({
        url: '/quest',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetQuestsQuery } = questsApi;
