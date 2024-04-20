import { ChatMessageSender } from '../../screens/chat/types';

export interface ICreateConversation {
  bot_id: number;
}

export type TChatBot = {
  id: string;
  createdDate: Date;
  updatedDate: Date;
  name: string;
  description: string;
  profileImage: string;
  voiceCharacteristics: string;
  difficultyLevel: number;
};

export type TConversation = {
  id: string;
  createdDate: Date;
  updatedDate: Date;
  userEmail: string;
  title: string;
  bot: TChatBot;
};

export type Message = {
  conversation: string;
  id: string;
  messageText: string;
  senderEmail: string;
  senderType: ChatMessageSender;
  createdDate: Date;
  updatedDate: Date;
};

export interface LastMessageObject {
  [key: string]: LastMessage;
}

export type LastMessage = {
  msg: string;
  timestamp: Date;
};

type SortBy = 'asc' | 'desc';

export interface IMessageCountQuery {
  botId: string;
  sort?: SortBy;
  daysLimit?: number;
}

export type MessageCount = {
  date: Date;
  botId: string;
  messageCount: number;
};
