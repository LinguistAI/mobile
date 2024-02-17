export type WordDefinition = {
  word: string;
  meanings: string[];
  examples: string[];
};

export type TWordList = {
  listId: string;
  title: string;
  description: string;
  isPinned: boolean;
  isActive: boolean;
  isFavorite: boolean;
};

// API types 
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