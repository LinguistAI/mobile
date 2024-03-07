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
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/wordbank` }),
  tagTypes: ['WordList'],
  endpoints: (builder) => ({
    createWordList: builder.mutation<IWordListWithUserInfo, ICreateWordList>({
      query: (list) => ({
        url: 'lists',
        method: 'POST',
        body: list,
      }),
      invalidatesTags: ['WordList'],
    }),
    getWordLists: builder.query<IWordListsWithUserInfo, void>({
      query: () => ({
        url: 'lists',
        method: 'GET',
      }),
      providesTags: ['WordList'],
    }),
    getWordList: builder.query<IWordListWithWordInfo, string>({
      query: (listId) => ({
        url: `list/${listId}`,
        method: 'GET',
      }),
      providesTags: ['WordList'],
    }),
    editList: builder.mutation<void, IEditWordList>({
      query: (editedList) => ({
        url: 'lists',
        method: 'PUT',
        body: editedList,
      }),
      invalidatesTags: ['WordList'],
    }),
    deleteList: builder.mutation<void, string>({
      query: (listId) => ({
        url: `list/${listId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WordList'],
    }),
    addWord: builder.mutation<void, IAddWord>({
      query: (addWord) => ({
        url: 'add-word',
        method: 'POST',
        body: addWord,
      }),
      invalidatesTags: ['WordList'],
    }),
    activateWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'lists/activate',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordList'],
    }),
    deactivateWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'lists/deactivate',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordList'],
    }),
    addWordListToFavorite: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'lists/add-favorite',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordList'],
    }),
    removeWordListFromFavorites: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'lists/remove-favorite',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordList'],
    }),
    pinWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'lists/pin',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordList'],
    }),
    unpinWordList: builder.mutation<void, string>({
      query: (listId) => ({
        url: 'lists/unpin',
        method: 'POST',
        body: { listId },
      }),
      invalidatesTags: ['WordList'],
    }),
    getWordMeanings: builder.query<IDictionaryResponse, string[]>({
      queryFn: async (wordList, queryApi, extraOptions, baseQuery) => {
        try {
          // Assuming axiosSecure can be used similarly outside of the baseQuery context
          const response = await axiosSecure.post('/dictionary', { wordList });
          // Assuming the response structure is { data: DictionaryResponse }
          if (response.data) {
            return { data: response.data };
          } else {
            return { error: { status: 'CUSTOM_ERROR', error: 'No data returned' } };
          }
        } catch (axiosError) {
          let err = axiosError;
          return { error: { status: err.response?.status || 'FETCH_ERROR', error: err.message } };
        }
      },
    }),
  }),
});

export const {
  useCreateWordListMutation,
  useGetWordListsQuery,
  useGetWordListQuery,
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
