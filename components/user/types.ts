import { ChatMessage } from "../../screens/chat/types";

export interface ExtendedChatMessage extends ChatMessage {
  skippable?: boolean;
}
