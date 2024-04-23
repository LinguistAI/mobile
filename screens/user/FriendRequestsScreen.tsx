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
    <View style={{ paddingTop: 8 }}>
      <Title size={'h4'}>Received</Title>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={receivedRequestsByReceiveDate}
        renderItem={({ item }) => <FriendRequestCard friendship={item} type={getFriendRequestType(item)} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}
          >
            <CenteredFeedback
              message="You don't have any incoming friendship requests, stay tuned for upcoming requests!"
              size={16}
            >
              <Ionicons name="file-tray-sharp" size={30} color={Colors.gray[600]} />
            </CenteredFeedback>
          </View>
        }
      />
      <Divider />
      <Title size={'h4'}>Sent</Title>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={sentRequestsByReceiveDate}
        renderItem={({ item }) => <FriendRequestCard friendship={item} type={getFriendRequestType(item)} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1, height: '100%' }}
          >
            <CenteredFeedback message="You don't have any pending requests" size={16}>
              <Ionicons name="file-tray-sharp" size={30} color={Colors.gray[600]} />
            </CenteredFeedback>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    gap: 10,
    padding: 10,
  },
  requestTypeCard: {
    borderRadius: 0,
  },
});

export default FriendRequestsScreen;
