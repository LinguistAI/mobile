import { ChatMessageSender } from "../../screens/chat/types";

export interface ICreateConversation {
    bot_id: number;
}

export type TChatBot = {
    id: string;
    createdDate: Date;
    updatedDate: Date;
    name: string;
    description: string
    profileImage: string;
    voiceCharacteristics: string;
    difficultyLevel: number;
}

export type TConversation = {
    id: string;
    createdDate: Date;
    updatedDate: Date;
    userEmail: string;
    title: string;
    bot: TChatBot;
}

export type Message = {
    conversation: string;
    id: string;
    messageText: string;
    senderEmail: string;
    senderType: ChatMessageSender;
    createdDate: Date;
    updatedDate: Date
}