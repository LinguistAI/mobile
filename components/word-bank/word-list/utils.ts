import { TWordList } from './types';

export const search = (searchText: string, wordList: TWordList[]) => {
  const searchedList = wordList.filter(
    (list) =>
      list?.title?.toLowerCase().includes(searchText?.toLowerCase()) ||
      list?.description?.toLowerCase().includes(searchText?.toLowerCase()) ||
      list?.words?.some((word) => word.toLowerCase().includes(searchText?.toLowerCase()))
  );
  return searchedList;
};
