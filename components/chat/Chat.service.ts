import { axiosSecure } from "../../services"
import { APIResponse } from "../../types"
import { TChatBot, TConversation } from "./types"

export const getAvailableBots = async () => {
    const response = await axiosSecure.get<APIResponse<TChatBot[]>>("/ml/conversation/bots")
    return response.data
}

export const getAllConversations = async () => {
    const response = await axiosSecure.get<APIResponse<TConversation[]>>("/ml/conversation/user")
    return response.data
}

export const getAllChatMessages = async (conversationId: string) => {
    const response = await axiosSecure.get(`/ml/conversation/chat/all/${conversationId}`)
    return response.data
}

export const createNewConversation = async (botId: string) => {
    const response = await axiosSecure.post<APIResponse<TConversation>>(`/ml/conversation/create`, {
        botId
    })
    return response.data
}

export const sendChatMessage = async (conversationId: string, message: string) => {
    const response = await axiosSecure.post(`/ml/conversation/chat/send/${conversationId}`, {
            message
    })
    return response.data
}