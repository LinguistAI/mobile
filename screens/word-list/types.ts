export type WordDefinition = {
  word: string;
  meanings: string[];
  examples: string[];
};

export type WordList = {
  id: string;
  name: string;
  words: WordDefinition[];
  listStats: {
    mastered: number;
    reviewing: number;
    learning: number;
  };
  imageUrl: string;
};
