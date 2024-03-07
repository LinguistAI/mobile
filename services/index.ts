import axios, { AxiosError, isAxiosError } from "axios";
import * as SecureStorage from "expo-secure-store";
import { StoredUserInfoWithTokens } from "../types";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

const decideBackendURL = (): string => {
  if (process.env.NODE_ENV === "production") {
    return process.env.EXPO_PUBLIC_API_URL as string;
  }
  else if (process.env.NODE_ENV === "development") {
    return process.env.EXPO_PUBLIC_LOCAL_API_URL as string;
  }

   throw new Error("Environment not set");
};

export const axiosBase = axios.create({
  baseURL: decideBackendURL(),
  headers: { "Content-Type": "application/json" },
});

export const axiosSecure = axios.create({
  baseURL: decideBackendURL(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosSecure.interceptors.request.use(
  async (config) => {
    const ssUser = await SecureStorage.getItemAsync("user");
    const user = JSON.parse(ssUser as string) as StoredUserInfoWithTokens;
    if (!config?.headers!["Authorization"]) {
      config.headers!["Authorization"] = `Bearer ${user["accessToken"]}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error.code === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const userJson = await SecureStorage.getItemAsync("user");
      if (!userJson) {
      // TODO: Redirect to homepage
        return;
      }
      const user = JSON.parse(userJson);
      if (!user) {
      // TODO: Redirect to homepage
        return;
      }
      const res = await axios.get<{ accessToken: string }>("/auth/refresh", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.refreshToken}`,
        },
      });
      user.accessToken = res.data.accessToken;
      SecureStorage.setItemAsync("user", JSON.stringify(user));
      prevRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
      return axiosSecure(prevRequest);
    } else {
      // TODO: Redirect to homepage
    }
    return Promise.reject(error);
  }
);

export const createAxiosBaseQuery = ({ baseUrl } = { baseUrl: '' }): BaseQueryFn<{
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
}, unknown, unknown> => async ({ url, method, data, headers = {} }) => {
  try {
    const response = await axiosSecure({
      url: baseUrl + url,
      method,
      data,
      headers,
    });

    // Successful response
    return { data: response.data };
  } catch (axiosError: any) {
    let err = axiosError;
    // Check if the error is an Axios error
    if (isAxiosError(axiosError)) {
      err = axiosError?.response?.data;
    }

    // Error handling
    return {
      error: { status: err.status || 'FETCH_ERROR', msg: err.data || err },
    };
  }
};

export const isDataResponse = <T>(response: any): response is { data: T } => {
  return response && response.data;
}