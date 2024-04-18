import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosSecure, createAxiosBaseQuery } from '../../services';
import { QCheckMCQAnswer, QCreateMCQ, QFinishMCQ, RCheckMCQAnswer, RCreateMCQ, RFinishMCQ } from './types';

export const quizApi = createApi({
  reducerPath: 'gamificationApi',
  baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}/ml/mcq` }),
  endpoints: (builder) => ({
    checkAnswer: builder.mutation<RCheckMCQAnswer, QCheckMCQAnswer>({
      query: (body) => ({
        method: 'POST',
        url: '/question/answer',
        body,
      }),
    }),
    createMCQ: builder.mutation<RCreateMCQ, QCreateMCQ>({
      query: (body) => ({
        method: 'POST',
        url: '/test/create',
        body,
      }),
    }),
    finishMCQ: builder.mutation<RFinishMCQ, QFinishMCQ>({
      query: (body) => ({
        method: 'POST',
        url: '/test/finish',
        body,
      }),
    }),
  }),
});

export const { useCheckAnswerMutation, useCreateMCQMutation, useFinishMCQMutation } = quizApi;
