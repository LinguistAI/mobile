import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGetFriendsQuery, useRemoveFriendMutation } from '../../userApi';
import FriendProfileCard from './FriendProfileCard';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import FetchError from '../../../common/FetchError';
import { LinearGradient } from 'expo-linear-gradient';
import CenteredFeedback from '../../../common/CenteredFeedback';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../../theme/colors';
import { useCallback, useState } from 'react';

const FriendsList = () => {
  const { data: friends, isLoading, isError, refetch } = useGetFriendsQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
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
  if (!friends) {
    return <FetchError />;
  }

  return (
    <View style={styles.root}>
      <FlatList
        numColumns={1}
        contentContainerStyle={styles.friendsListStyle}
        data={friends}
        renderItem={({ item }) => <FriendProfileCard friendship={item} />}
        ListEmptyComponent={
          <View style={{ height: '80%', display: 'flex', justifyContent: 'center' }}>
            <CenteredFeedback
              icon={<Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />}
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

export default FriendsList;
