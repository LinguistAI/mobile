import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useGetQuestsQuery } from './api';
import QuestCard from './QuestCard';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import FetchError from '../common/FetchError';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import React, { useCallback, useState } from 'react';
import QuestCountdownTimer from "./QuestCountdownTimer";
import {useFocusEffect} from "@react-navigation/native";

const QuestsList = () => {
  const { data: quests, isFetching, isError, refetch } = useGetQuestsQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const renderSkeletonList = () => {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerPlaceholder key={index} style={styles.skeletonRectangle} LinearGradient={LinearGradient} />
        ))}
      </View>
    );
  };

  if (isFetching) {
    return renderSkeletonList();
  }
  if (isError || !quests) {
    return <FetchError />;
  }

  return (
    <View style={styles.root}>
      {quests.length > 0 && <QuestCountdownTimer assignedDate={quests[0].assignedDate} />}
      <FlatList
        numColumns={1}
        contentContainerStyle={styles.questsListStyle}
        data={quests}
        renderItem={({ item }) => <QuestCard quest={item} />}
        ListEmptyComponent={<CenteredFeedback icon={<Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />} message="No quests available right now. Check back later!" />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  questsListStyle: {
    gap: 10,
    padding: 10,
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
    display: 'flex',
  },
  skeletonRectangle: {
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
  }
});

export default QuestsList;
