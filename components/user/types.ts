import { ChatMessage } from '../../screens/chat/types';

export interface ExtendedChatMessage extends ChatMessage {
  skippable?: boolean;
}

type AnswerType = 'date' | 'multiple-choice' | 'text' | '';

export type ConversationStep = {
  id: number;
  trigger: number;
  skippable: boolean;
  name: string;
  message: string;
  skippedMsg: string;
  type: AnswerType;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  answerFormatter?: (input: any) => string;
};

export interface IUserDetailedInfo {
  name: string;
  birthDate: string;
  englishLevel: string;
  hobbies: string[];
}

export interface QFriendRequest {
  friendId: string;
}

export enum FriendshipStatus {
  PENDING,
  ACCEPTED,
}

export type RFriendshipRequest = {
  user1: User;
  user2: User;
  date: Date;
  status: FriendshipStatus;
};
