import { atom } from "jotai";
import { TWordList } from "./types";

type WordListAction = {
    type: "addWord" | "removeWord" | "removeList",
    payload: any;
}

const wordListsAtom = atom<TWordList[]>([])

const wordListReducerAtom = atom(
    (get) => get(wordListsAtom),
    (get, set, action: WordListAction) => {
        if (action.type === "addWord") {
            const { targetListId, word } = action.payload;
            const currentWordLists = get(wordListsAtom);
            const updatedWordLists = currentWordLists.map(list => {
                if (list.listId === targetListId) {
                    return { ...list, words: [...list.words, word] };
                }
                return list;
            });
            set(wordListsAtom, updatedWordLists);
        }
        else if (action.type === "removeWord") {
            const { targetListId, targetWord} = action.payload
            const currentWordLists = get(wordListsAtom);
            const updatedWordLists = currentWordLists.map(list => {
                if (list.listId === targetListId) {
                    const updatedWords = list.words.filter(word => word !== targetWord)
                    return {...list, words: updatedWords}
                }

                return list;
            })
            set(wordListsAtom, updatedWordLists)
        }
        else if (action.type === "removeList") {
            const { targetListId} = action.payload
            const currentWordLists = get(wordListsAtom);
            const updatedWordLists = currentWordLists.filter(list => list.listId !== targetListId)
            set(wordListsAtom, updatedWordLists)
        }
    }
)

export {wordListsAtom, wordListReducerAtom}