import { useGetLoggedDatesQuery } from './userStatsApi';
import { DEFAULT_DAY_LIMIT, DEFAULT_SORT, STAT_POLLING_INTERVAL } from './constants';
import React from 'react';
import LoggedDatesCalendarFromData from './LoggedDatesCalendarFromData';

const UserLoggedDatesCalendar = () => {
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
    <LoggedDatesCalendarFromData
      data={data}
      isLoading={isLoading}
      isError={isError}
      fulfilledTimeStamp={fulfilledTimeStamp}
      refetch={refetch}
      dayLimit={DEFAULT_DAY_LIMIT}
    />
  );
};

export default UserLoggedDatesCalendar;
