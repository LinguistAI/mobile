import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FriendRequest, RFriendRequest, RFriendship } from '../../types';
import Card from '../../../common/Card';
import Colors from '../../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import ActionIcon from '../../../common/ActionIcon';
import { useAcceptFriendRequestMutation, useRejectFriendRequestMutation } from '../../userApi';
import useNotifications from '../../../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../../../utils/httpUtils';
import React from 'react';
import LText from '../../../common/Text';
import { formatDistanceToNow } from 'date-fns';

interface FriendRequestCardProps {
  friendship: RFriendRequest;
  type: FriendRequest;
}

const FriendRequestCard = ({ friendship, type }: FriendRequestCardProps) => {
  const { add } = useNotifications();
  const { user1, user2, date } = friendship;
  const sendUser = type === FriendRequest.RECEIVED ? user1 : user2;

  const [accept, { isLoading: isAccepting, error: acceptError }] = useAcceptFriendRequestMutation();
  const [reject, { isLoading: isRejecting, error: rejectError }] = useRejectFriendRequestMutation();

  const handleAcceptRequest = async () => {
    await accept({ friendId: sendUser.id });

    if (acceptError) {
      add({
        body: generateErrorResponseMessage(acceptError, "Couldn't accept the request."),
        type: 'error',
      });
    }
  };
  const handleRejectRequest = async () => {
    console.log('usre', sendUser);
    await reject({ friendId: sendUser.id });

    if (rejectError) {
      add({
        body: generateErrorResponseMessage(rejectError, "Couldn't reject the request."),
        type: 'error',
      });
    }
  };

  const isTakingAction = isAccepting || isRejecting;

  const renderRequestActions = () => {
    switch (type) {
      case FriendRequest.RECEIVED:
        return (
          <View style={styles.actionsRoot}>
            <Pressable
              onPress={handleAcceptRequest}
              style={[styles.actionContainer, styles.acceptActionContainer]}
            >
              <ActionIcon
                onPress={handleAcceptRequest}
                loading={isAccepting}
                disabled={isTakingAction}
                icon={<Ionicons name="checkmark-circle-outline" size={21} color={Colors.gray[100]} />}
              />
              <LText style={styles.actionText}>Accept</LText>
            </Pressable>
            <Pressable
              onPress={handleRejectRequest}
              style={[styles.actionContainer, styles.rejectActionContainer]}
            >
              <ActionIcon
                onPress={handleRejectRequest}
                loading={isRejecting}
                disabled={isTakingAction}
                icon={<Ionicons name="close-circle-outline" size={21} color={Colors.gray[100]} />}
              />
              <LText style={styles.actionText}>Reject</LText>
            </Pressable>
          </View>
        );
      case FriendRequest.SENT:
        return (
          <View style={styles.actionsRootSent}>
            <Pressable
              onPress={handleRejectRequest}
              style={[styles.actionContainer, styles.rejectActionContainer]}
            >
              <ActionIcon
                onPress={handleRejectRequest}
                loading={isRejecting}
                disabled={isTakingAction}
                icon={<Ionicons name="close-circle-outline" size={22} color={Colors.gray[100]} />}
              />
              <LText style={styles.actionText}>Cancel</LText>
            </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <View style={styles.contentRoot}>
        <View style={styles.infoContainer}>
          <LText style={styles.mainInfo}>{sendUser.username}</LText>
          <LText style={styles.subinfo}>{formatDistanceToNow(new Date(date))} ago</LText>
        </View>
        <View style={styles.actionsRoot}>{renderRequestActions()}</View>
      </View>
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
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
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
    fontSize: 12,
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
  acceptActionContainer: {
    borderColor: Colors.green[600],
    backgroundColor: Colors.green[500],
  },
  rejectActionContainer: {
    borderColor: Colors.red[600],
    backgroundColor: Colors.red[500],
  },
  actionText: {
    color: Colors.gray[100],
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
  },
  actionsRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  actionsRootSent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
});

export default FriendRequestCard;
