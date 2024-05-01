import { WordStatus } from '../word-bank/word-list/types';
import { useGetWordLearningStatsQuery } from './userStatsApi';
import { STAT_POLLING_INTERVAL } from './constants';
import WordLearningStatusBarChartFromData from './WordLearningStatusBarChartFromData';

const LABELS = {
  [WordStatus.LEARNING]: 'Learning',
  [WordStatus.REVIEWING]: 'Reviewing',
  [WordStatus.MASTERED]: 'Mastered',
};

const WordLearningStatusBarChart = () => {
  const {
    data: wordLearningStats,
    isLoading,
    isError,
    refetch,
    fulfilledTimeStamp,
  } = useGetWordLearningStatsQuery(undefined, { pollingInterval: STAT_POLLING_INTERVAL });

  return (
    <WordLearningStatusBarChartFromData
      data={wordLearningStats}
      isLoading={isLoading}
      isError={isError}
      fulfilledTimeStamp={fulfilledTimeStamp}
      refetch={refetch}
    />
  );
};

export default WordLearningStatusBarChart;
