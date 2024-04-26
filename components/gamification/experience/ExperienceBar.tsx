import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGetUserExperienceQuery } from '../api';
import * as Progress from 'react-native-progress';
import FetchError from '../../common/feedback/FetchError';
import Colors from '../../../theme/colors';
import ExperienceSkeleton from './ExperienceSkeleton';
import { getCurrentLevelTotalExperience, getProgressRatio } from './utils';
import { BAR_HEIGHT, BAR_WIDTH } from './constants';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import ExperienceBarFromData from './ExperienceBarFromData';

const ExperienceBar = () => {
  const { data, isFetching: isExperienceFetching, isError, refetch } = useGetUserExperienceQuery();
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <View>
      <ExperienceBarFromData data={data} isFetching={isExperienceFetching} isError={isError} />
    </View>
  );
};

export default ExperienceBar;
