import { StyleSheet, Text, View } from 'react-native';
import Card from '../../common/Card';
import Colors from '../../../theme/colors';
import ActionIcon from '../../common/ActionIcon';
import { useSendFriendRequestMutation } from '../userApi';
import { Ionicons } from '@expo/vector-icons';
import useNotifications from '../../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';

interface UserProfileCardProps {
  user: User;
  friendActions?: boolean;
}

const UserProfileCard = ({ user, friendActions }: UserProfileCardProps) => {
  const [addFriend, { isLoading, isError, error }] = useSendFriendRequestMutation();
  const { add } = useNotifications();

  const handleSendFriendRequest = async () => {
    await addFriend({ friendId: user.id });
    if (isError) {
      add({
        body: generateErrorResponseMessage(error),
        type: 'error',
      });
      return;
    }

    add({
      body: `Sent a friend request to '${user.username}'`,
      type: 'success',
    });
  };

  const renderFriendActions = () => {
    if (!friendActions) return null;

    return (
      <View style={styles.requestBtnContainer}>
        <ActionIcon
          onPress={handleSendFriendRequest}
          icon={<Ionicons name="add-circle-outline" size={24} color={Colors.primary[500]} />}
        />
        <Text style={styles.requestBtnText} onPress={handleSendFriendRequest}>
          Send request
        </Text>
      </View>
    );
  };

  return (
    <Card>
      <View style={styles.contentRoot}>
        {renderFriendActions()}
        <View style={styles.infoContainer}>
          <Text style={styles.mainInfo}>{user.username}</Text>
          <View style={styles.subInfoContainer}>
            <Text style={styles.subinfo}>{user.email}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentRoot: {
    padding: 10,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  subInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  subinfo: {
    color: Colors.gray[500],
    fontSize: 13,
  },
  requestBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestBtnText: {
    color: Colors.grape[400],
  },
});

export default UserProfileCard;
