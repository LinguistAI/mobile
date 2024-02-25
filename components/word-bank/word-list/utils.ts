import { isEmptyObj } from '../../utils';
import { DictionaryWordGroup, TWordList } from './types';

export const search = (searchText: string, wordList: TWordList[]) => {
  const searchedList = wordList.filter(
    (list) =>
      list?.title?.toLowerCase().includes(searchText?.toLowerCase()) ||
      list?.description?.toLowerCase().includes(searchText?.toLowerCase()) ||
      list?.words?.some((word) => word.toLowerCase().includes(searchText?.toLowerCase()))
  );
  return searchedList;
};


export const isDictionaryWordGroup = (group: {} | {wordGroup: DictionaryWordGroup[]}): group is {wordGroup: DictionaryWordGroup[]}  => {
  if (isEmptyObj(group) || !group) {
    return false
  }

  return true
}