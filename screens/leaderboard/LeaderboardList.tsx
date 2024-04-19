import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGetFriendsQuery, useLazyGetGlobalLeaderboardQuery } from '../../components/user/userApi';
import FetchError from '../../components/common/FetchError';
import CenteredFeedback from '../../components/common/CenteredFeedback';
import Colors from '../../theme/colors';
import LeaderboardUserCard from './LeaderboardUserCard';
import useUser from '../../hooks/useUser';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 15;

const LeaderboardList = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trigger, { data: leaderboard, isLoading, isError, isFetching }, lastPromiseInfo] =
    useLazyGetGlobalLeaderboardQuery();
  const { user } = useUser();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await trigger({ size: DEFAULT_PAGE_SIZE });
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    trigger({ size: DEFAULT_PAGE_SIZE });
  }, []);

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
  if (!leaderboard) {
    return <FetchError />;
  }

  return (
    <View style={styles.root}>
      <FlatList
        numColumns={1}
        contentContainerStyle={styles.friendsListStyle}
        data={leaderboard.xprankings}
        renderItem={({ item, index }) => <LeaderboardUserCard leaderboardUser={item} loggedInUser={user.username} />}
        ListEmptyComponent={
          <View style={{ height: '80%', display: 'flex', justifyContent: 'center' }}>
            <CenteredFeedback
              icon={<Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />} // TODO update later put this only in the friends
              message="Looks like you have no friends just yet. Send a friend request to meet with new people!"
            />
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  friendsListStyle: {
    padding: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  leaderboardRank: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  skeletonRectangle: {
    borderRadius: 10,
    width: '90%',
    height: 75,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default LeaderboardList;
