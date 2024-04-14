import { ContributionGraph } from 'react-native-chart-kit';
import { Sort } from '../../types';
import { useGetLoggedDatesQuery } from './userStatsApi';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import Title from '../common/Title';
import { getGraphDimensions } from './utils';

const DEFAULT_DAY_LIMIT = 75;
const DEFAULT_SORT = Sort.DESC;

const LoggedDatesCalendar = () => {
  const { width, height } = getGraphDimensions();
  const { data, isLoading, isError } = useGetLoggedDatesQuery({
    daysLimit: DEFAULT_DAY_LIMIT,
    sort: DEFAULT_SORT,
  });

  if (isLoading) return null;
  if (isError) return null;

  const getStats = () => {
    if (!data) return [];

    return data?.loggedDates.map((d) => {
      return { date: d, count: 1 };
    });
  };

  const handleTooltip: any = {};

  return (
    <View style={styles.container}>
      <Title size="h4">Daily Login Tracker</Title>
      <ContributionGraph
        values={getStats()}
        endDate={new Date()}
        numDays={DEFAULT_DAY_LIMIT}
        width={width}
        height={height}
        tooltipDataAttrs={(value) => handleTooltip}
        style={{
          borderColor: Colors.primary[600],
          borderWidth: 1,
          borderRadius: 16,
          alignSelf: 'center',
        }}
        chartConfig={{
          backgroundGradientFrom: Colors.gray[100],
          backgroundGradientTo: Colors.gray[200],
          color: (opacity = 1) => `rgba(34, 184, 207, ${opacity})`,
          labelColor: () => Colors.primary[600],
        }}
        gutterSize={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});

export default LoggedDatesCalendar;
