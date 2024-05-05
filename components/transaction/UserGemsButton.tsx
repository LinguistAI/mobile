import {StyleSheet, View, ActivityIndicator} from 'react-native';
import Colors from '../../theme/colors';
import { useGetTransactionQuery } from './api';
import FetchError from '../common/feedback/FetchError';
import CenteredFeedback from '../common/feedback/CenteredFeedback';
import React from "react";
import GemsIndicatorButton from "./GemsIndicatorButton";

const UserGems = () => {
  const { data, isError, isLoading } = useGetTransactionQuery();

  if (isLoading) {
    return (
      <View style={styles.root}>
        <ActivityIndicator size={40} color={Colors.gray[0]} />
      </View>
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

const styles = StyleSheet.create({
  root: {
    marginLeft: 120,
    marginRight: 120,
    padding: 5,
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
  },
});

export default UserGems;
