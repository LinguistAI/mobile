export type WordDefinition = {
  word: string;
};


export type TWordList = {
  listId: string;
  title: string;
  description: string;
  isPinned: boolean;
  isActive: boolean;
  isFavorite: boolean;
  words: string[]
};

// User service 
export interface IWordListsWithUserInfo {
  ownerUsername: string;
  lists: TWordList[];
}

export interface IWordListWithUserInfo extends TWordList{
 ownerUsername: string;
}

export interface ICreateWordList {
  title: string;
  description: string;
  isActive: boolean;
  isFavorite: boolean;
  isPinned: boolean;
};

export interface IEditWordList {
  listId: string;
  editedList: Partial<ICreateWordList>
};

export interface IAddWord {
  listId: string;
  word: string;
};

// Dictionary service
export interface DictionaryResponse {
  [id: string]: { wordGroup: DictionaryWordGroup[] } | {}; // api response -> meta -> id
}

interface DictionaryWordGroup {
  id: string; // api response -> meta -> id
  word: string;
  audio: string; // 2.6 PRONUNCIATIONS: PRS in documentation
  func_label: string; // verb, noun, adjective, etc.
  meaning: WordDef[];
}

interface WordDef {
  definition: string;
  examples?: string[];
}
