export type ChatMessage = {
  id?: string;
  content: string;
  sender: ChatMessageSender;
  timestamp: Date;
};

export type OpenAIChatMessage = {
  content: string;
  role: ChatMessageSender;
};

export enum ChatMessageSender {
  system = "system",
  assistant = "assistant",
  user = "user",
}

export type OpenAIChatRequestDto = {
  model: string;
  messages: OpenAIChatMessage[];
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
};
