import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { RStoreItemsPage, RUserItemsPage, IUserExperience, IUserStreak, QPurchaseItem, RUserGems } from './types';

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
    getStoreItems: builder.query<RStoreItemsPage, void>({
      query: () => ({
        url: '/store/all-enabled',
        method: 'GET',
      }),
      keepUnusedDataFor: 1,
    }),
    getUserItems: builder.query<RUserItemsPage, void>({
      query: () => ({
        url: '/store/user-items',
        method: 'GET',
      }),
      keepUnusedDataFor: 1,
    }),
    purchaseItem: builder.mutation<void, QPurchaseItem>({
      query: ({ itemId }) => ({
        url: `/store/purchase?itemId=${itemId}`,
        method: 'POST',
      }),
    }),
    getTransaction: builder.query<RUserGems, void>({
      query: () => ({
        url: '/transaction',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserStreakQuery, useGetUserExperienceQuery, useGetStoreItemsQuery, useGetUserItemsQuery, usePurchaseItemMutation, useGetTransactionQuery } = gamificationApi;
