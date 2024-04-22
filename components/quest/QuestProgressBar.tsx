import { StyleSheet, Text, View } from 'react-native';
import { useGetQuestsQuery } from './api';
import IonIcons from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Colors from '../../theme/colors';
import ExperienceSkeleton from '../gamification/experience/ExperienceSkeleton';
import { BAR_HEIGHT, BAR_WIDTH, EMPTY_BAR_FILL, QUEST_DONE_ICON_SIZE } from './constants';
import FetchError from '../common/feedback/FetchError';
import CenteredFeedback from '../common/feedback/CenteredFeedback';

interface QuestProgressBarProps {
  goalTimes: number;
  progressTimes: number;
}

const QuestProgressBar = ({ goalTimes, progressTimes }: QuestProgressBarProps) => {
  const { data, isFetching: isQuestsFetching, isError } = useGetQuestsQuery();

  if (isQuestsFetching) {
    return <ExperienceSkeleton />;
  }

  if (isError) {
    return <FetchError />;
  }

  if (!data) {
    return <CenteredFeedback message="Cannot access quests info." />;
  }

  const renderCurrentExperience = () => {
    if (progressTimes < goalTimes) {
      return (
        <Text style={styles.xpText}>
          {progressTimes} / {goalTimes}
        </Text>
      );
    }

    return <IonIcons name="checkmark-circle-sharp" size={QUEST_DONE_ICON_SIZE} color={Colors.green[800]} />;
  };

  const renderQuestBarColor = () => {
    if (progressTimes < goalTimes) {
      return Colors.primary[600];
    }

    return Colors.green[800];
  };

  return (
    <View>
      <View style={styles.xpInfoContainer}>
        {renderCurrentExperience()}
        <Progress.Bar
          progress={progressTimes / goalTimes === 0 ? EMPTY_BAR_FILL : progressTimes / goalTimes}
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          borderRadius={8}
          color={renderQuestBarColor()}
          unfilledColor={Colors.gray[100]}
          borderWidth={1}
        />
      </View>
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

export default QuestProgressBar;
