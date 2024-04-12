import { StyleSheet, View } from 'react-native';
import { useGetFriendRequestsQuery } from '../../components/user/userApi';
import { FlatList } from 'react-native-gesture-handler';
import FriendProfileCard from '../../components/user/profile/friends/FriendProfileCard';

const FriendRequestsScreen = () => {
  const { data: friendRequests, isLoading, isError } = useGetFriendRequestsQuery();

  const renderListSkeleton = () => {};

  if (isLoading) {
    return;
  }

  if (isError) {
    return;
  }

  if (!friendRequests || friendRequests.length === 0) {
    return;
  }

  const requestsCopy = [...friendRequests];
  const sortedByLastDate = requestsCopy.sort(
    (a, b) => new Date(a.date).getMilliseconds() - new Date(b.date).getMilliseconds()
  );
  return (
    <View>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={sortedByLastDate}
        renderItem={({ item }) => <FriendProfileCard friendship={item} isRequest />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    gap: 10,
    padding: 10,
  },
});

export default FriendRequestsScreen;
