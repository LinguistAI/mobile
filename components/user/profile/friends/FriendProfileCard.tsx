import { StyleSheet, Text, View } from 'react-native';
import { RFriendship } from '../../types';
import Card from '../../../common/Card';
import Colors from '../../../../theme/colors';
import Divider from '../../../common/Divider';
import ActionIcon from '../../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { useRemoveFriendMutation } from '../../userApi';
import useNotifications from '../../../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../../../utils/httpUtils';

interface FriendProfileCardProps {
  friendship: RFriendship;
}

const FriendProfileCard = ({ friendship }: FriendProfileCardProps) => {
  const { username: friendUsername, id: friendId } = friendship;
  const { add } = useNotifications();

  const [removeFriend, { isLoading: isRemovingFriend, error }] = useRemoveFriendMutation();

  const onRemoveFriend = async (friendId: string) => {
    await removeFriend({ friendId });
    if (error) {
      add({
        body: generateErrorResponseMessage(error),
        type: 'error',
      });
    }
  };

  return (
    <Card>
      <View style={styles.contentRoot}>
        <View style={styles.infoContainer}>
          <View style={styles.mainInfoContainer}>
            <Text style={styles.mainInfo}>{friendUsername}</Text>
            <ActionIcon
              onPress={() => onRemoveFriend(friendId)}
              icon={<Ionicons name="close-circle-outline" size={24} color={Colors.red[600]} />}
            />
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
  mainInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
});

export default FriendProfileCard;
