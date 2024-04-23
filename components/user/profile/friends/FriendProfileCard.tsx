import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFriendship } from '../../types';
import Card from '../../../common/Card';
import Colors from '../../../../theme/colors';
import Divider from '../../../common/Divider';
import ActionIcon from '../../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { useRemoveFriendMutation } from '../../userApi';
import useNotifications from '../../../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../../../utils/httpUtils';
import React from 'react';
import LText from '../../../common/Text';

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
            <LText style={styles.mainInfo}>{friendUsername}</LText>
            <Pressable
              onPress={() => onRemoveFriend(friendId)}
              style={[styles.actionContainer, styles.removeActionContainer]}
            >
              <ActionIcon
                onPress={() => onRemoveFriend(friendId)}
                icon={<Ionicons name="close-circle-outline" size={22} color={Colors.red[600]} />}
              />
              <LText style={styles.actionText}>Remove</LText>
            </Pressable>
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  mainInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.primary[500],
    marginLeft: 8,
  },
  subinfo: {
    color: Colors.gray[500],
    fontSize: 13,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  removeActionContainer: {
    borderColor: Colors.red[600],
    backgroundColor: Colors.red[0],
  },
  actionText: {
    color: Colors.red[600],
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
  },
});

export default FriendProfileCard;
