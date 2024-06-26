import { View, ActivityIndicator } from 'react-native';
import Colors from '../../../theme/colors';
import FetchError from '../../common/feedback/FetchError';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import GemsIndicator from './GemsIndicator';
import React from 'react';
import { useGetTransactionQuery } from '../api';

const UserGems = () => {
  const { data, isError, isLoading } = useGetTransactionQuery();

  if (isLoading) {
    return <GemsIndicator gemCount={data ?? null} loading />;
  }

  if (isError) {
    return <FetchError />;
  }

  if (!data) {
    return <CenteredFeedback message="Cannot access gems info." />;
  }

  return <GemsIndicator gemCount={data.gems} />;
};

export default UserGems;
