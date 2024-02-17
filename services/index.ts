import axios from "axios";
import * as SecureStorage from "expo-secure-store";
import { StoredUserInfoWithTokens } from "../screens/common/Auth.types";

const decideBackendURL = (): string => {
  if (process.env.NODE_ENV === "production") {
    return process.env.EXPO_PUBLIC_API_URL as string;
  }
  else if (process.env.NODE_ENV === "development") {
    return process.env.EXPO_PUBLIC_LOCAL_API_URL as string;
  }


   throw new Error("Environment not set");
};

console.log("decideBackendURL", decideBackendURL());  

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
    if (error?.response?.status === 403 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const userJson = await SecureStorage.getItemAsync("user");
      if (!userJson) {
        return;
      }
      const user = JSON.parse(userJson);
      if (!user) {
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
    }
    return Promise.reject(error);
  }
);
