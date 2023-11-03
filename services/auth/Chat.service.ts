import { axiosBase, axiosOpenAI, axiosSecure } from "..";
import { APIResponse } from "../../types/common";
import { OpenAIChatRequestDto } from "../../types/common/Chat.types";

export async function sendChatMessage(
  openAIChatRequestDto: OpenAIChatRequestDto
) {
  const res = await axiosOpenAI.post<any>(
    "/chat/completions",
    openAIChatRequestDto
  );
  return res;
}
