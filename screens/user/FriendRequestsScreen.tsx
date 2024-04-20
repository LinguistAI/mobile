import { RefreshControl, StyleSheet, View } from 'react-native';
import { useGetFriendRequestsQuery } from '../../components/user/userApi';
import { FlatList } from 'react-native-gesture-handler';
import FriendRequestCard from '../../components/user/profile/friends/FriendRequestCard';
import useUser from '../../hooks/useUser';
import { FriendRequest, RFriendRequest } from '../../components/user/types';
import CardSkeleton from '../../components/common/CardSkeleton';
import FetchError from '../../components/common/FetchError';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { useCallback, useState } from 'react';
import CenteredFeedback from '../../components/common/feedback/CenteredFeedback';

const FriendRequestsScreen = () => {
  const { user } = useUser();
  const { data: friendRequests, isLoading, isError, refetch } = useGetFriendRequestsQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, []);

  const getFriendRequestType = (request: RFriendRequest) => {
    const { user1: sendUser } = request;
    if (sendUser.email === user.email) {
      return FriendRequest.SENT;
    }

    return FriendRequest.RECEIVED;
  };

  const requestsCopy = friendRequests ? [...friendRequests] : [];
  const receivedRequestsByReceiveDate = requestsCopy
    .filter((req) => getFriendRequestType(req) === FriendRequest.RECEIVED)
    .sort((a, b) => new Date(a.date).getMilliseconds() - new Date(b.date).getMilliseconds());

  const renderListSkeleton = () => <CardSkeleton height={100} count={6} />;

  if (isLoading) {
    return <View style={{ marginTop: 10 }}>{renderListSkeleton()}</View>;
  }

  if (isError) {
    return <FetchError />;
  }

  if (!receivedRequestsByReceiveDate) {
    return <FetchError />;
  }

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={receivedRequestsByReceiveDate}
        renderItem={({ item }) => <FriendRequestCard friendship={item} type={getFriendRequestType(item)} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}
          >
            <CenteredFeedback message="Your friend request inbox is empty, stay tuned for upcoming requests!">
              <Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />
            </CenteredFeedback>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    flex: 1,
    gap: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default FriendRequestsScreen;
