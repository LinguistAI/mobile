import { ContributionGraph } from 'react-native-chart-kit';
import { SortBy } from '../../types';
import { useGetLoggedDatesQuery } from './userStatsApi';
import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import Title from '../common/Title';
import { getGraphDimensions } from './utils';
import RefetchButton from './RefetchButton';
import FetchError from '../common/feedback/FetchError';
import { DEFAULT_DAY_LIMIT, DEFAULT_SORT, STAT_POLLING_INTERVAL } from './constants';
import React from 'react';
import LoggedDatesCalendarFromData from './LoggedDatesCalendarFromData';

const LoggedDatesCalendar = () => {
  const { data, isLoading, isError, fulfilledTimeStamp, refetch } = useGetLoggedDatesQuery(
    {
      daysLimit: DEFAULT_DAY_LIMIT,
      sort: DEFAULT_SORT,
    },
    {
      pollingInterval: STAT_POLLING_INTERVAL,
    }
  );

  return (
    <View>
      <LoggedDatesCalendarFromData
        data={data}
        isLoading={isLoading}
        isError={isError}
        fulfilledTimeStamp={fulfilledTimeStamp}
        refetch={refetch}
        dayLimit={DEFAULT_DAY_LIMIT}
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
