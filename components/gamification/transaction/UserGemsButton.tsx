import { useFocusEffect } from '@react-navigation/native';
import FetchError from '../../common/feedback/FetchError';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import React, { useCallback } from 'react';
import GemsIndicatorButton from './GemsIndicatorButton';
import { useGetTransactionQuery } from '../api';

const UserGems = () => {
  const { data, isError, isLoading, refetch } = useGetTransactionQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return <GemsIndicatorButton gemCount={data ?? null} loading onClick={() => {}} />;
  }

  if (isError) {
    return <FetchError />;
  }

  if (!data) {
    return <CenteredFeedback message="Cannot access gems info." />;
  }

  return <GemsIndicatorButton gemCount={data.gems} onClick={() => {}} />;
};

export default UserGems;
