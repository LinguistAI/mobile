import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import {
  IDictionaryResponse,
  IAddWord,
  ICreateWordList,
  IEditWordList,
  IWordListWithUserInfo,
  IWordListWithWordInfo,
  IWordListsWithUserInfo,
} from './word-list/types';

export const wordBankApi = createApi({
  reducerPath: 'wordBankApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/` }),
  tagTypes: ['WordLists', 'WordList'],
  endpoints: (builder) => ({
    createWordList: builder.mutation<IWordListWithUserInfo, ICreateWordList>({
      query: (list) => ({
        url: 'wordbank/lists',
        method: 'POST',
        body: list,
      }),
      invalidatesTags: ['WordLists'],
    }),
    getWordLists: builder.query<IWordListsWithUserInfo, void>({
      query: () => ({
        url: 'wordbank/lists',
        method: 'GET',
      }),
      providesTags: ['WordLists'],
    }),
    getWordListById: builder.query<IWordListWithWordInfo, string>({
      query: (listId) => ({
        url: `wordbank/list/${listId}`,
        method: 'GET',
      }),
      providesTags: ['WordList'],
    }),
    editList: builder.mutation<void, IEditWordList>({
      query: (editedList) => ({
        url: 'wordbank/lists',
        method: 'PUT',
        body: editedList,
      }),
      invalidatesTags: ['WordLists'],
    }),
    deleteList: builder.mutation<void, string>({
      query: (listId) => ({
        url: `wordbank/list/${listId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WordLists'],
    }),
    addWord: builder.mutation<void, IAddWord>({
      query: (addWord) => ({
        url: 'wordbank/add-word',
        method: 'POST',
        body: addWord,
      }),
      invalidatesTags: ['WordList'],
    }),
    activateWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'wordbank/lists/activate',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordLists'],
    }),
    deactivateWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'wordbank/lists/deactivate',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordLists'],
    }),
    addWordListToFavorite: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'wordbank/lists/add-favorite',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordLists'],
    }),
    removeWordListFromFavorites: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'wordbank/lists/remove-favorite',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordLists'],
    }),
    pinWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'wordbank/lists/pin',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordLists'],
    }),
    unpinWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'wordbank/lists/unpin',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordLists'],
    }),
    getWordMeanings: builder.query<IDictionaryResponse, string[]>({
      query: (words) => ({
        url: `dictionary`,
        method: 'POST',
        body: { wordList: words },
      }),
    }),
  }),
});

export const {
  useCreateWordListMutation,
  useGetWordListsQuery,
  useGetWordListByIdQuery,
  useEditListMutation,
  useActivateWordListMutation,
  useAddWordListToFavoriteMutation,
  useAddWordMutation,
  useDeactivateWordListMutation,
  useDeleteListMutation,
  useGetWordMeaningsQuery,
  usePinWordListMutation,
  useRemoveWordListFromFavoritesMutation,
  useUnpinWordListMutation,
} = wordBankApi;
