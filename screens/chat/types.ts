export type ChatMessage = {
  id?: string;
  content: string;
  sender: ChatMessageSender;
  timestamp: Date;
};

export enum ChatMessageSender {
  system = "system",
  assistant = "bot",
  user = "user",
}
