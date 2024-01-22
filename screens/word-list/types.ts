export type WordDefinition = {
  word: string;
  meanings: string[];
  examples: string[];
};

export type WordList = {
  id: string;
  title: string;
  description: string;
  words: WordDefinition[];
  listStats: {
    mastered: number;
    reviewing: number;
    learning: number;
  };
  imageUrl: string;
  pinned: boolean;
  isActive: boolean;
};
