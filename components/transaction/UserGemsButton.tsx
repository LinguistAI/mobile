import {View, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../theme/colors';
import { useGetTransactionQuery } from './api';
import FetchError from '../common/feedback/FetchError';
import CenteredFeedback from '../common/feedback/CenteredFeedback';
import React, { useCallback } from "react";
import GemsIndicatorButton from "./GemsIndicatorButton";

const UserGems = () => {
  const { data, isError, isLoading, refetch } = useGetTransactionQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <GemsIndicatorButton gemCount={<ActivityIndicator size={40} color={Colors.gray[0]} />} onClick={() => {}} />
    );
  }

  if (isError) {
    return <FetchError />;
  }

  if (!data) {
    return <CenteredFeedback message='Cannot access gems info.' />;
  }

  return (
    <GemsIndicatorButton gemCount={data.gems} onClick={() => {}} />
  );
}

export default UserGems;
