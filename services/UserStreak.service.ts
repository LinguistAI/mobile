import { axiosSecure } from ".";
import { APIResponse } from "../types/common";

export function getUserChatStreak() {
  const res = axiosSecure.get<APIResponse<UserStreak>>("/user-streak");
  return res;
}
