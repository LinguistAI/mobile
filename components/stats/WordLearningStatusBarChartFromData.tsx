import { BarChart } from 'react-native-chart-kit';
import { WordStatus } from '../word-bank/word-list/types';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import Title from '../common/Title';
import { getGraphDimensions } from './utils';
import RefetchButton from './RefetchButton';
import FetchError from '../common/feedback/FetchError';
import { RWordLearning } from './types';

const LABELS = {
  [WordStatus.LEARNING]: 'Learning',
  [WordStatus.REVIEWING]: 'Reviewing',
  [WordStatus.MASTERED]: 'Mastered',
};

interface WordLearningChartProps {
  data: RWordLearning | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: any;
  fulfilledTimeStamp: number | undefined;
}

const WordLearningStatusBarChartFromData = ({
  data: wordLearningStats,
  isLoading,
  isError,
  refetch,
  fulfilledTimeStamp,
}: WordLearningChartProps) => {
  const { width, height } = getGraphDimensions();

  if (isLoading) return null;
  if (isError || !wordLearningStats) return <FetchError withNavigation={false} />;

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

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.root}>
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
        fromZero={true}
        style={{
          borderRadius: 16,
        }}
      />
      <RefetchButton
        style={{ alignSelf: 'flex-end' }}
        lastUpdate={new Date(fulfilledTimeStamp!)} // TODO test this
        onPress={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
  },
});

export default WordLearningStatusBarChartFromData;
