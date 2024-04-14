import { StyleSheet, View } from 'react-native';
import { useGetFriendRequestsQuery } from '../../components/user/userApi';
import { FlatList } from 'react-native-gesture-handler';
import FriendProfileCard from '../../components/user/profile/friends/FriendProfileCard';
import FriendRequestCard from '../../components/user/profile/friends/FriendRequestCard';
import useUser from '../../hooks/useUser';
import { FriendRequest, RFriendship } from '../../components/user/types';
import CardSkeleton from '../../components/common/CardSkeleton';
import CenteredFeedback from '../../components/common/CenteredFeedback';
import FetchError from '../../components/common/FetchError';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';

const FriendRequestsScreen = () => {
  const { user } = useUser();
  const { data: friendRequests, isLoading, isError } = useGetFriendRequestsQuery();

  const getFriendRequestType = (request: RFriendship) => {
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

  if (!receivedRequestsByReceiveDate || receivedRequestsByReceiveDate.length === 0) {
    return (
      <View style={{ height: '80%', display: 'flex', justifyContent: 'center' }}>
        <CenteredFeedback
          icon={<Ionicons name="file-tray-sharp" size={40} color={Colors.gray[600]} />}
          message="Your friend request inbox is empty, stay tuned for upcoming requests!"
        />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={receivedRequestsByReceiveDate}
        renderItem={({ item }) => <FriendRequestCard friendship={item} type={getFriendRequestType(item)} />}
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
