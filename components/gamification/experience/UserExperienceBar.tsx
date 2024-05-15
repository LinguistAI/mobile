import { useFocusEffect } from '@react-navigation/native';
import FetchError from '../../common/feedback/FetchError';
import { useGetUserExperienceQuery } from '../api';
import ExperienceBar from './ExperienceBar';
import ExperienceBarSkeleton from './ExperienceBarSkeleton';
import { useCallback } from 'react';

const UserExperienceBar = () => {
  const { data, isLoading, isError, refetch } = useGetUserExperienceQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return <ExperienceBarSkeleton />;
  }

  if (isError || !data) {
    return <FetchError withNavigation={false} />;
  }

  return <ExperienceBar data={data} />;
};

export default UserExperienceBar;
