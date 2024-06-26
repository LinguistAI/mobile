import { SortBy } from '../../types';
import { WordStatus } from '../word-bank/word-list/types';

export interface QLoggedDate {
  daysLimit: number;
  sort?: SortBy;
}

export interface RLoggedDate {
  loggedDates: string[];
}

export interface RWordLearning {
  listStats: {
    [WordStatus.MASTERED]: number;
    [WordStatus.LEARNING]: number;
    [WordStatus.REVIEWING]: number;
  };
}
