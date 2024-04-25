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
import { useNavigation } from '@react-navigation/native';

interface FriendProfileCardProps {
  friendship: RFriendship;
}

const FriendProfileCard = ({ friendship }: FriendProfileCardProps) => {
  const { username: friendUsername, id: friendId } = friendship;
  const { add } = useNotifications();
  const navigation = useNavigation();

  const [removeFriend, { isLoading: isRemovingFriend, error }] = useRemoveFriendMutation();

  const onPressFriendProfile = () => {
    navigation.navigate('FriendProfile', { friendId });
  };

  return (
    <Card>
      <View style={styles.contentRoot}>
        <View style={styles.infoContainer}>
          <View style={styles.mainInfoContainer}>
            <LText style={styles.mainInfo}>{friendUsername}</LText>
            <Pressable
              onPress={onPressFriendProfile}
              style={[styles.actionContainer, styles.removeActionContainer]}
            >
              <ActionIcon
                onPress={onPressFriendProfile}
                icon={<Ionicons name="people-circle-outline" size={36} color={'black'} />}
              />
              {/* <ActionIcon
                onPress={() => onRemoveFriend(friendId)}
                icon={<Ionicons name="close-circle-outline" size={22} color={Colors.red[500]} />}
              /> */}
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
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  removeActionContainer: {
    borderColor: Colors.red[600],
    backgroundColor: Colors.red[0],
  },
  actionText: {
    color: Colors.red[600],
    fontSize: 13,
    marginRight: 2,
  },
});

export default FriendProfileCard;
