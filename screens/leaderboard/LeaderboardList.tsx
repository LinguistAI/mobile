import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import CenteredFeedback from '../../components/common/feedback/CenteredFeedback';
import FetchError from '../../components/common/feedback/FetchError';
import { RLeaderboard } from '../../components/user/types';
import useUser from '../../hooks/useUser';
import Colors from '../../theme/colors';
import LeaderboardUserCard from './LeaderboardUserCard';

interface LeaderboardListProps {
  data: RLeaderboard | undefined;
  message: string;
  isDataLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const LeaderboardList = ({ data, message, isDataLoading, isRefreshing, onRefresh }: LeaderboardListProps) => {
  const { user } = useUser();
  const flatListRef = useRef<FlatList<any>>(null);
  const [rowHeights, setRowHeights] = useState<number[]>([]);
  const [numVisibleRows, setNumVisibleRows] = useState<number>(0);

  useEffect(() => {
    const screenHeight = Dimensions.get('window').height - 100;
    const calculatedNumVisibleRows = Math.floor(screenHeight / getItemLayout(0, 0).length);
    setNumVisibleRows(calculatedNumVisibleRows);
  }, []);

  useEffect(() => {
    if (data && flatListRef.current) {
      const loggedUserIndex = data.xprankings.findIndex((item) => item.user.username === user.username);

      if (loggedUserIndex !== -1) {
        // Calculate the target index to scroll to (approximately the middle of the screen)
        let targetIndex = Math.max(loggedUserIndex - Math.floor(numVisibleRows / 2), 0);
        flatListRef.current.scrollToIndex({ animated: true, index: targetIndex });
      }
    }
  }, [data]);

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

  if (isDataLoading) {
    return renderSkeletonList();
  }
  if (!data) {
    return <FetchError />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.flatList}>
        <FlatList
          ref={flatListRef}
          numColumns={1}
          contentContainerStyle={styles.friendsListStyle}
          data={data.xprankings}
          renderItem={({ item, index }) => (
            <View onLayout={(event) => measureRowHeight(index, event.nativeEvent.layout.height)}>
              <LeaderboardUserCard leaderboardUser={item} loggedInUser={user.username} />
            </View>
          )}
          ListEmptyComponent={
            <View style={{ height: '85%', display: 'flex', justifyContent: 'center' }}>
              <CenteredFeedback message={message}>
                <Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />
              </CenteredFeedback>
            </View>
          }
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          getItemLayout={getItemLayout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    maxHeight: '90%',
    backgroundColor: 'white',
  },
  flatList: {
    overflow: 'hidden', // This ensures that content inside the FlatList respects the border radius
  },
  friendsListStyle: {},
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
