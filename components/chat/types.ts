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
  voiceCharacteristics: PollyVoiceID;
  difficultyLevel: number;
};

export type UnknownWord = {
  confidenceLevel: number;
  word: string;
  id: string;
};

export type TConversation = {
  id: string;
  createdDate: Date;
  updatedDate: Date;
  userEmail: string;
  title: string;
  bot: TChatBot;
  lastMessage: string;
  unknownWords: UnknownWord[];
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

export enum ChatOption {
  CLEAR_CONVERSATION = 'Clear Conversation',
  ACTIVE_WORDS = 'Active Words',
}

export type ChatOptionObject = {
  label: string;
  value: ChatOption;
  icon: React.ReactElement;
};


export type QSynthesizeSpeech = {
  messageId: string;
  text: string;
  pollyVoiceId?: PollyVoiceID;
};

export type RSynthesizeSpeech = {
  audio: string;
};

export type QGetSpeech = {
  messageId: string;
};

export type PollyVoiceID =
  | 'Danielle'
  | 'Gregory'
  | 'Ivy'
  | 'Joanna'
  | 'Kendra'
  | 'Kimberly'
  | 'Salli'
  | 'Joey'
  | 'Justin'
  | 'Kevin'
  | 'Matthew'
  | 'Ruth'
  | 'Stephen';

interface MessagePaginationParams {
  page: number;
  pageSize: number;
}

export interface QMessages {
  conversationId: string;
  params: MessagePaginationParams;
}

export type RTranscribeMsg = {
  msg: string;
  jobName: string;
};

export type RTranscribeResult = {
  result: RTranscribeTranscriptResult[];
};

export type RTranscribeTranscriptResult = {
  transcript: string;
};

export type QTranscribe = {
  key: string;
};
