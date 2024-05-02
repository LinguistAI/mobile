import { RefreshControl, StyleSheet, View, Text } from 'react-native';
import { useGetFriendRequestsQuery } from '../../components/user/userApi';
import { FlatList } from 'react-native-gesture-handler';
import FriendRequestCard from '../../components/user/profile/friends/FriendRequestCard';
import useUser from '../../hooks/useUser';
import { FriendRequest, RFriendRequest } from '../../components/user/types';
import CardSkeleton from '../../components/common/CardSkeleton';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import React, { useCallback, useState } from 'react';
import FetchError from '../../components/common/feedback/FetchError';
import CenteredFeedback from '../../components/common/feedback/CenteredFeedback';
import Title from '../../components/common/Title';
import Divider from '../../components/common/Divider';

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
  const sentRequestsByReceiveDate = requestsCopy
    .filter((req) => getFriendRequestType(req) === FriendRequest.SENT)
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
    <View style={styles.root}>
      <View style={styles.text}>
        <Title size="h4">Received</Title>
      </View>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={receivedRequestsByReceiveDate}
        renderItem={({ item }) => <FriendRequestCard friendship={item} type={getFriendRequestType(item)} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}
          >
            <CenteredFeedback message="Stay tuned for upcoming requests!" size={16} />
          </View>
        }
      />
      <Divider />
      <View style={styles.text}>
        <Title size="h4">Sent</Title>
      </View>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={sentRequestsByReceiveDate}
        renderItem={({ item }) => <FriendRequestCard friendship={item} type={getFriendRequestType(item)} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}
          >
            <CenteredFeedback message="You don't have any pending requests!" size={16} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: 8, 
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    gap: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  requestTypeCard: {
    borderRadius: 0,
  },
  text: {
    marginLeft: 8,
    marginTop: 5
  }
});

export default FriendRequestsScreen;
