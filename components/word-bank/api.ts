import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import {
  IWord,
  ICreateWordList,
  IDictionaryResponse,
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
      keepUnusedDataFor: 0,
    }),
    getWordListById: builder.query<IWordListWithWordInfo, string>({
      query: (listId) => ({
        url: `wordbank/list/${listId}`,
        method: 'GET',
      }),
      providesTags: (result, error, listId) => [{ type: 'WordList', id: listId }],
      keepUnusedDataFor: 0,
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
    addWord: builder.mutation<void, IWord>({
      query: (addWord) => ({
        url: 'wordbank/add-word',
        method: 'POST',
        body: addWord,
      }),
      invalidatesTags: ['WordLists', 'WordList'],
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
    deleteWord: builder.mutation<void, IWord>({
      query: (deleteWordParams) => ({
        url: `wordbank/word`,
        method: 'DELETE',
        params: deleteWordParams,
      }),
      invalidatesTags: ['WordLists', 'WordList'],
    }),
  }),
});

export const {
  useCreateWordListMutation,
  useGetWordListsQuery,
  useGetWordListByIdQuery,
  useEditListMutation,
  useActivateWordListMutation,
  useAddWordMutation,
  useDeactivateWordListMutation,
  useDeleteListMutation,
  useGetWordMeaningsQuery,
  usePinWordListMutation,
  useUnpinWordListMutation,
  useDeleteWordMutation,
} = wordBankApi;
