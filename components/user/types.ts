import { ChatMessage } from "../../screens/chat/types";

export interface ExtendedChatMessage extends ChatMessage {
  skippable?: boolean;
}

export type ConversationStep = {
  id: number;
  trigger: number;
  skippable: boolean;
  name: string;
  message: string;
  options?: { value: string; label: string }[];
};
