import { objectIsNotEmpty } from '../../utils';
import { IDictionaryWordGroup, TWordList, WordConfidence } from './types';

export const search = (searchText: string, wordList: TWordList[]) => {
  const searchedList = wordList.filter(
    (list) =>
      list?.title?.toLowerCase().includes(searchText?.toLowerCase()) ||
      list?.description?.toLowerCase().includes(searchText?.toLowerCase()) ||
      list?.words?.some((word) => word.toLowerCase().includes(searchText?.toLowerCase()))
  );
  return searchedList;
};

export const isDictionaryWordGroup = (
  group: {} | { wordGroup: IDictionaryWordGroup[] }
): group is { wordGroup: IDictionaryWordGroup[] } => {
  if (!objectIsNotEmpty(group) || !group) {
    return false;
  }

  return true;
};

export const displayWordConfidence = (confidence: WordConfidence) => {
  switch (confidence) {
    case WordConfidence.LOWEST:
      return 'Amateur';
    case WordConfidence.LOW:
      return 'Beginner';
    case WordConfidence.MODERATE:
      return 'Intermediate';
    case WordConfidence.HIGH:
      return 'Skilled';
    case WordConfidence.HIGHEST:
      return 'Expert';
    default:
      return 'Unknown';
  }
};

export const getReviewValueOfWordConfidence = (confidence: WordConfidence) => {
  switch (confidence) {
    case WordConfidence.LOWEST:
      return 1;
    case WordConfidence.LOW:
      return 2;
    case WordConfidence.MODERATE:
      return 3;
    case WordConfidence.HIGH:
      return 4;
    case WordConfidence.HIGHEST:
      return 5;
    default:
      return 0;
  }
};
