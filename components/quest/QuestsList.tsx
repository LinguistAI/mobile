import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useGetQuestsQuery } from './api';
import QuestCard from './QuestCard';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import FetchError from '../common/FetchError';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredFeedback from '../common/CenteredFeedback';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { useCallback, useState } from 'react';

const QuestsList = () => {
  const { data: quests, isLoading, isError, refetch } = useGetQuestsQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  if (isLoading) {
    return renderSkeletonList();
  }
  if (isError) return <FetchError />;
  if (!quests) {
    return <FetchError />;
  }

  return (
    <View style={styles.root}>
      <FlatList
        numColumns={1}
        contentContainerStyle={styles.questsListStyle}
        data={quests}
        renderItem={({ item }) => <QuestCard quest={item} isLoading={isLoading} />}
        ListEmptyComponent={
          <View style={{ height: '80%', display: 'flex', justifyContent: 'center' }}>
            <CenteredFeedback
              icon={<Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />}
              message="No quests available right now. Check back later!"
            />
          </View>
        }
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
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  skeletonRectangle: {
    borderRadius: 10,
    width: '90%',
    height: 75,
    alignSelf: 'center',
  },
});

export default QuestsList;
