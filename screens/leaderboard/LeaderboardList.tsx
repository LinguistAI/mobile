import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGetFriendsQuery, useLazyGetGlobalLeaderboardQuery } from '../../components/user/userApi';
import FetchError from '../../components/common/FetchError';
import CenteredFeedback from '../../components/common/CenteredFeedback';
import Colors from '../../theme/colors';
import LeaderboardUserCard from './LeaderboardUserCard';
import useUser from '../../hooks/useUser';
import ActionButton from '../../components/common/ActionButton';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 15;

const LeaderboardList = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [trigger, { data: leaderboard, isLoading, isError, isFetching }, lastPromiseInfo] =
    useLazyGetGlobalLeaderboardQuery();
  const { user } = useUser();
  const flatListRef = useRef<FlatList<any>>(null);
  const [rowHeights, setRowHeights] = useState<number[]>([]);
  const [numVisibleRows, setNumVisibleRows] = useState<number>(0);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      // setCurrentPage((prevPage) => prevPage - 1);
      trigger({ size: DEFAULT_PAGE_SIZE, page: currentPage - 1 });
    }
  };

  const goToNextPage = () => {
    // setCurrentPage((prevPage) => prevPage + 1);
    if (currentPage < totalPageNum - 1) {
      trigger({ size: DEFAULT_PAGE_SIZE, page: currentPage + 1 });
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await trigger({ size: DEFAULT_PAGE_SIZE, page: currentPage });
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    trigger({ size: DEFAULT_PAGE_SIZE });
    // setCurrentPage(leaderboard!.currentPage);
  }, []);

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height - 100;
    const calculatedNumVisibleRows = Math.floor(screenHeight / getItemLayout(0, 0).length);
    setNumVisibleRows(calculatedNumVisibleRows);
  }, []);

  useEffect(() => {
    if (leaderboard) {
      setCurrentPage(leaderboard.currentPage);
      setTotalPageNum(leaderboard.totalPages);

      console.log('curretn:', currentPage);
      console.log('total:', totalPageNum);
    }
    if (leaderboard && flatListRef.current) {
      const loggedUserIndex = leaderboard.xprankings.findIndex((item) => item.user.username === user.username);

      if (loggedUserIndex !== -1) {
        // Calculate the target index to scroll to (approximately the middle of the screen)
        let targetIndex = Math.max(loggedUserIndex - Math.floor(numVisibleRows / 2), 0);
        flatListRef.current.scrollToIndex({ animated: true, index: targetIndex });
      }
    }
  }, [leaderboard, currentPage]);

  const renderSkeletonList = () => {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerPlaceholder key={index} style={styles.skeletonRectangle} LinearGradient={LinearGradient} />
        ))}
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => {
    if (index >= rowHeights.length) {
      return { length: 0, offset: 0, index };
    }

    // Calculate the offset by summing the heights of all items before the current index
    const offset = rowHeights.slice(0, index).reduce((acc, height) => acc + height, 0);
    return { length: rowHeights[index], offset, index };
  };

  const measureRowHeight = (index: number, height: number) => {
    setRowHeights((prevRowHeights) => {
      const newHeights = [...prevRowHeights];
      newHeights[index] = height;
      return newHeights;
    });
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
      {totalPageNum > 1 ? (
        <View style={styles.pageButtons}>
          <TouchableOpacity onPress={goToPreviousPage} disabled={currentPage === 0}>
            <Ionicons name="chevron-back-circle-outline" size={32} color={currentPage === 0 ? 'gray' : 'black'} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, marginHorizontal: 15 }}>{currentPage + 1}</Text>
          <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPageNum - 1}>
            <Ionicons
              name="chevron-forward-circle-outline"
              size={32}
              color={currentPage === totalPageNum - 1 ? 'gray' : 'black'}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        ref={flatListRef}
        numColumns={1}
        contentContainerStyle={styles.friendsListStyle}
        data={leaderboard.xprankings}
        renderItem={({ item, index }) => (
          <View onLayout={(event) => measureRowHeight(index, event.nativeEvent.layout.height)}>
            <LeaderboardUserCard leaderboardUser={item} loggedInUser={user.username} />
          </View>
        )}
        ListEmptyComponent={
          <View style={{ height: '80%', display: 'flex', justifyContent: 'center' }}>
            <CenteredFeedback
              icon={<Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />} // TODO update later put this only in the friends
              message="Looks like you have no friends just yet. Send a friend request to meet with new people!"
            />
          </View>
        }
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginBottom: 100,
  },
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
  pageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    width: '99%',
    alignSelf: 'center',
    marginTop: 15,
  },
});

export default LeaderboardList;
