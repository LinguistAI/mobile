import { ChatMessage } from "../../screens/chat/types";
import { APIResponse } from "../../screens/common";
import { ChatbotResponse } from "./Chat.types";
import { axiosChatbot } from "..";

export async function sendChatMessage(message: ChatMessage, email: string) {
  console.log(message);
  const res = await axiosChatbot.post<APIResponse<ChatbotResponse>>(
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
