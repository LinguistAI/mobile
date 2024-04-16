import { BarChart } from 'react-native-chart-kit';
import { WordStatus } from '../word-bank/word-list/types';
import { View } from 'react-native';
import Colors from '../../theme/colors';
import { useGetWordLearningStatsQuery } from './userStatsApi';
import Title from '../common/Title';
import { getGraphDimensions } from './utils';

const LABELS = {
  [WordStatus.LEARNING]: 'Learning',
  [WordStatus.REVIEWING]: 'Reviewing',
  [WordStatus.MASTERED]: 'Mastered',
};

const WordLearningStatusBarChart = () => {
  const { width, height } = getGraphDimensions();
  const { data: wordLearningStats, isLoading, isError } = useGetWordLearningStatsQuery();

  if (isLoading) return null;
  if (isError) return null;
  if (!wordLearningStats) return null;

  const stats = wordLearningStats.listStats;
  const data = {
    labels: Object.values(LABELS),
    datasets: [
      {
        data: [stats[WordStatus.LEARNING], stats[WordStatus.REVIEWING], stats[WordStatus.MASTERED]],
        colors: [() => Colors.gray[400], () => Colors.yellow[400], () => Colors.green[400]],
      },
    ],
  };

  return (
    <View>
      <Title size="h4">Word Learning Progress</Title>
      <BarChart
        data={data}
        width={width}
        height={height}
        yAxisLabel=""
        xAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: Colors.primary[500],
          backgroundGradientTo: Colors.primary[600],
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        showBarTops={false}
        showValuesOnTopOfBars={true}
        withCustomBarColorFromData={true}
        flatColor={true}
        withInnerLines={false}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: 'center',
        }}
        fromZero={true}
      />
    </View>
  );
};

export default WordLearningStatusBarChart;
