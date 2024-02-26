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