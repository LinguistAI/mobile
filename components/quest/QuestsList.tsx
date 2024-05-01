import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useGetQuestsQuery } from './api';
import QuestCard from './QuestCard';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import React, { useCallback, useState } from 'react';
import QuestCountdownTimer from './QuestCountdownTimer';
import CenteredFeedback from '../common/feedback/CenteredFeedback';
import FetchError from '../common/feedback/FetchError';
import Title from '../common/Title';
import RefetchButton from '../stats/RefetchButton';
import { QUEST_POLLING_INTERVAL } from './constants';

const QuestsList = () => {
  const {
    data: quests,
    isLoading,
    isError,
    refetch,
    fulfilledTimeStamp,
  } = useGetQuestsQuery(undefined, { pollingInterval: QUEST_POLLING_INTERVAL });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    refetch();
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const renderSkeletonList = () => {
    return (
      <View style={styles.skeletonContainer}>
        <Title size="h4">Daily Quests</Title>
        {Array.from({ length: 1 }).map((_, index) => (
          <ShimmerPlaceholder
            key={index}
            style={styles.skeletonTitleRectangle}
            LinearGradient={LinearGradient}
          />
        ))}
        {Array.from({ length: 3 }).map((_, index) => (
          <ShimmerPlaceholder key={index} style={styles.skeletonRectangle} LinearGradient={LinearGradient} />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return renderSkeletonList();
  }

  if (isError || !quests) {
    return <FetchError withNavigation={false} />;
  }

  return (
    <View style={styles.root}>
      <Title size="h4">Daily Quests</Title>
      {quests.length > 0 && <QuestCountdownTimer assignedDate={quests[0].assignedDate} />}
      <FlatList
        numColumns={1}
        contentContainerStyle={styles.questsListStyle}
        data={quests}
        renderItem={({ item }) => <QuestCard quest={item} />}
        ListEmptyComponent={
          <CenteredFeedback message="No quests available right now. Check back later!">
            <Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />
          </CenteredFeedback>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        nestedScrollEnabled={true}
      />
      <RefetchButton
        style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: -10 }}
        lastUpdate={new Date(fulfilledTimeStamp)}
        onPress={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  questsListStyle: {
    gap: 10,
    padding: 10,
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    gap: 10,
    marginTop: 16,
  },
  skeletonRectangle: {
    borderRadius: 10,
    width: '90%',
    height: 100,
    alignSelf: 'center',
  },
  skeletonTitleRectangle: {
    borderRadius: 10,
    width: '90%',
    height: 75,
    alignSelf: 'center',
  },
  timerContainer: {
    padding: 10,
    backgroundColor: Colors.primary[600],
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 24,
    color: Colors.gray[100],
    fontWeight: 'bold',
    textShadowColor: Colors.gray[800],
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    marginLeft: 6,
    marginRight: 5,
  },
});

export default QuestsList;
