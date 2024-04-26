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
import { IUserExperience } from '../types';

interface XPBarProps {
  data: IUserExperience | undefined;
  isFetching: boolean;
  isError: boolean;
  // refetch: () => void; // TODO wtf
}

const ExperienceBarFromData = ({ data, isFetching: isExperienceFetching, isError }: XPBarProps) => {
  if (isExperienceFetching) {
    return <ExperienceSkeleton />;
  }

  if (isError) {
    return <FetchError />;
  }

  if (!data) {
    return <CenteredFeedback message="Cannot access level info." />;
  }

  const getProgress = () => {
    return getProgressRatio(data.currentExperience, data.totalExperienceToNextLevel);
  };

  const renderCurrentLevel = () => {
    return <Text style={styles.levelText}>{data?.level ? `Level ${data.level}` : 'Level 1'}</Text>;
  };

  const renderCurrentExperience = () => {
    return (
      <Text style={styles.xpText}>
        {data.currentExperience} / {getCurrentLevelTotalExperience(data.totalExperienceToNextLevel)}
      </Text>
    );
  };

  return (
    <View>
      <View style={styles.xpInfoContainer}>
        {renderCurrentLevel()}
        {renderCurrentExperience()}
      </View>
      <Progress.Bar
        progress={getProgress()}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        borderRadius={8}
        color={Colors.primary[600]}
        unfilledColor={Colors.gray[300]}
        borderWidth={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  xpInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  levelText: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  xpText: {
    fontSize: 16,
    color: Colors.primary[600],
  },
});

export default ExperienceBarFromData;
