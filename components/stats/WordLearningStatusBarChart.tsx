import { BarChart } from 'react-native-chart-kit';
import { WordStatus } from '../word-bank/word-list/types';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import { useGetWordLearningStatsQuery } from './userStatsApi';
import Title from '../common/Title';
import { getGraphDimensions } from './utils';
import RefetchButton from './RefetchButton';
import FetchError from '../common/feedback/FetchError';
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
    <View>
      <WordLearningStatusBarChartFromData
        data={wordLearningStats}
        isLoading={isLoading}
        isError={isError}
        fulfilledTimeStamp={fulfilledTimeStamp}
        refetch={refetch}
      />
    </View>
  );
};

export default WordLearningStatusBarChart;
