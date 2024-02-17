import { axiosSecure } from "../../services";
import { APIResponse } from "../common";
import { IAddWord, ICreateWordList, IEditWordList, TWordList } from "./types";

export const createList = async (list: ICreateWordList) => {
    const response = await axiosSecure.post("/wordbank/lists", list);
    return response.data;
}

export const getLists = async () => {
    const response = await axiosSecure.get<APIResponse<TWordList[]>>("/wordbank/lists");
    return response.data;
}

export const editList = async (editedList: IEditWordList) => {
    const response = await axiosSecure.put("/wordbank/lists", editedList);
    return response.data;
}

export const deleteList = async (listId: string) => {
    const response = await axiosSecure.delete(`/wordbank/lists/${listId}`);
    return response.data;
}

export const addWord = async (addWord: IAddWord) => {
    const response = await axiosSecure.post("/wordbank/add-word", addWord);
    return response.data;
}
 
export const activateWordList = async (listId: string) => {
    const response = await axiosSecure.post(`/wordbank/lists/activate`, { listId });
    return response.data;
}

export const deactivateWordList = async (listId: string) => {
    const response = await axiosSecure.post("/wordbank/lists/deactivate", { listId });
    return response.data;
}

export const addWordListToFavorite = async (listId: string) => {
    const response = await axiosSecure.post(`/wordbank/lists/add-favorite`, { listId });
    return response.data;
}

export const removeWordListFromFavorites = async (listId: string) => {
    const response = await axiosSecure.post("/wordbank/lists/remove-favorite", { listId });
    return response.data;
}

export const pinWordList = async (listId: string) => {
    const response = await axiosSecure.post("/wordbank/lists/pin", { listId });
    return response.data;
}

export const unpinWordList = async (listId: string) => {
    const response = await axiosSecure.post("/wordbank/lists/unpin", { listId });
    return response.data;
}