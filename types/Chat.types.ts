export type ChatMessage = {
  id?: string;
  content: string;
  sender: ChatMessageSender;
  timestamp: Date;
};

export enum ChatMessageSender {
  system = "system",
  assistant = "assistant",
  user = "user",
}
