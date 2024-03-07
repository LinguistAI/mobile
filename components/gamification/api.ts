import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosSecure, createAxiosBaseQuery } from "../../services";
import { IUserStreak } from "./types";

export const gamificationApi = createApi({
    reducerPath: "gamificationApi",
    baseQuery: createAxiosBaseQuery({ baseUrl: `${axiosSecure.defaults.baseURL}` }),
    endpoints: (builder) => ({
        getUserStreak:  builder.query<IUserStreak, void>({
            query: () => ({
                url: "/user-streak",
                method: "GET",
            }),
        }),
    })
})

export const { useGetUserStreakQuery } = gamificationApi;