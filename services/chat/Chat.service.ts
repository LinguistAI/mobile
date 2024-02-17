import { axiosSecure } from "..";
import { ChatMessage } from "../../screens/chat/types";
import { APIResponse } from "../../screens/common";
import { ChatbotResponse } from "./Chat.types";

export async function sendChatMessage(message: ChatMessage, email: string) {
  console.log(message);
  const res = await axiosSecure.post<APIResponse<ChatbotResponse>>(
    "/chat",
    {
      prompt: message.content,
      email: email,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
}
