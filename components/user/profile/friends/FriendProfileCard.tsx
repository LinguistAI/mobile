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
      <Pressable onPress={onPressFriendProfile}>
        <View style={styles.actionContainer}>
          <LText style={styles.mainInfo}>{friendUsername}</LText>
          <ActionIcon
            onPress={onPressFriendProfile}
            icon={<Ionicons name="caret-forward" size={30} color={Colors.primary[500]} />}
          />
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentRoot: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionText: {
    color: Colors.red[600],
    fontSize: 13,
    marginRight: 2,
  },
});

export default FriendProfileCard;
