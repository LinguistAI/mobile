import * as ImagePicker from 'expo-image-picker';
import React, { useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  RefreshControl,
  Pressable,
  ActionSheetIOS,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  useAcceptFriendRequestMutation,
  useGetFriendProfileQuery,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
} from '../../userApi';
import Colors from '../../../../theme/colors';
import Divider from '../../../common/Divider';
import ExperienceBarFromData from '../../../gamification/experience/ExperienceBarFromData';
import ChatStreakView from '../../../gamification/streak/ChatStreakView';
import LText from '../../../common/Text';
import Title from '../../../common/Title';
import ReadOnlyItemGroup from '../../../common/form/ReadOnlyItemGroup';
import { Ionicons } from '@expo/vector-icons';
import { FriendSearchFriendshipStatus } from '../../types';
import FriendshipCardOptionMenu from './FriendshipCardOptionMenu';
import { ECancelMenuOption, EIncomingMenuOption, EMenuOption } from './types';
import PopupMenu from '../../../common/PopupMenu';
import LoadingIndicator from '../../../common/feedback/LoadingIndicator';

const FriendProfile = () => {
  const [profileImage, setProfileImage] = useState('https://thispersondoesnotexist.com');
  const route = useRoute();
  const { friendId } = route.params;

  const [menuVisible, setMenuVisible] = useState(false);
  const [removeFriend] = useRemoveFriendMutation();
  const [sendRequest] = useSendFriendRequestMutation();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [rejectRequest] = useRejectFriendRequestMutation();

  const {
    data: profileInfo,
    isFetching: isProfileFetching,
    error: profileError,
    fulfilledTimeStamp,
    isError,
    refetch: profileRefetch,
  } = useGetFriendProfileQuery(friendId); // TODO update this with friend profile
  const [refreshing, setRefreshing] = useState(false);
  // const friendshipStatus = FriendSearchFriendshipStatus.FRIEND;
  const friendshipStatus = profileInfo?.friendshipStatus;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const hobbies =
    profileInfo?.hobbies.map((h) => {
      return {
        value: h,
        name: h,
      };
    }) || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await profileRefetch();
    setRefreshing(false);
  }, [profileRefetch]);

  // TODO SELIM burası kafayı yedi, gondermiyo requestler donuyo falan bazen oluyo
  const renderFriendsButton = () => {
    return (
      <View>
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={[styles.actionContainer, styles.actionAlreadyFriend]}
        >
          <LText style={styles.actionText}>Friends</LText>
          {isProfileFetching && fulfilledTimeStamp ? (
            <ActivityIndicator size={24} color={Colors.gray[0]} />
          ) : (
            <Ionicons name="caret-down" size={20} color={Colors.gray[0]} style={styles.actionIcon} />
          )}
        </Pressable>
        <FriendshipCardOptionMenu
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          triggerOption={triggerOption}
          menuOptions={getMenuOptions()}
        />
        <View style={styles.menuContainer}></View>
      </View>
    );
  };

  const renderSendRequestButton = () => {
    return isProfileFetching && fulfilledTimeStamp ? (
      <View>
        <Pressable
          onPress={handleSendFriendRequest}
          style={[styles.actionContainer, styles.actionSendRequest]}
        >
          <Ionicons name="person-add" size={22} color={Colors.gray[0]} style={styles.actionIcon} />
          <LText style={styles.actionText}>Sending </LText>
          <ActivityIndicator size={24} color={Colors.gray[0]} />
        </Pressable>
      </View>
    ) : (
      <View>
        <Pressable
          onPress={handleSendFriendRequest}
          style={[styles.actionContainer, styles.actionSendRequest]}
        >
          <Ionicons name="person-add" size={22} color={Colors.gray[0]} style={styles.actionIcon} />
          <LText style={styles.actionText}>Send Request</LText>
        </Pressable>
      </View>
    );
  };

  const renderIncomingRequestButton = () => {
    return (
      <View>
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={[styles.actionContainer, styles.actionIncomingRequest]}
        >
          <LText style={styles.actionText}>Incoming Request</LText>
          {isProfileFetching && fulfilledTimeStamp ? (
            <ActivityIndicator size={24} color={Colors.gray[0]} />
          ) : (
            <Ionicons name="caret-down" size={24} color={Colors.gray[0]} style={styles.actionIcon} />
          )}
        </Pressable>
        <PopupMenu
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          triggerOption={triggerOptionIncomingRequest}
          menuOptions={getMenuOptionsIncomingRequest()}
        />
      </View>
    );
  };

  const renderPendingRequestButton = () => {
    return (
      <View>
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={[styles.actionContainer, styles.actionPendingRequest]}
        >
          <LText style={styles.actionText}>Pending</LText>
          {isProfileFetching && fulfilledTimeStamp ? (
            <ActivityIndicator size={24} color={Colors.gray[0]} />
          ) : (
            <Ionicons name="caret-down" size={24} color={Colors.gray[0]} style={styles.actionIcon} />
          )}
        </Pressable>
        <PopupMenu
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          triggerOption={triggerOptionCancelRequest}
          menuOptions={getMenuOptionsCancel()}
        />
      </View>
    );
  };

  const handleSendFriendRequest = () => {
    sendRequest({ friendId });
  };
  // TODO
  // add all Actio
  // after completing the actions update the UI accordingly
  // friend search incoming request no icon fix it
  const renderFriendButtonBasedOnStatus = () => {
    switch (friendshipStatus) {
      case FriendSearchFriendshipStatus.FRIEND:
        return renderFriendsButton();
      case FriendSearchFriendshipStatus.NOT_EXIST:
        return renderSendRequestButton();
      case FriendSearchFriendshipStatus.REQUEST_RECEIVED:
        return renderIncomingRequestButton();
      case FriendSearchFriendshipStatus.REQUEST_SENT:
        return renderPendingRequestButton();
      default:
        return renderSendRequestButton();
    }
  };

  const triggerOption = (option: EMenuOption) => {
    switch (option) {
      case EMenuOption.REMOVE:
        removeFriend({ friendId });
        break;
      default:
        break;
    }
    setMenuVisible(false);
  };

  const triggerOptionIncomingRequest = (option: EIncomingMenuOption) => {
    switch (option) {
      case EIncomingMenuOption.ACCEPT:
        acceptRequest({ friendId });
        break;
      case EIncomingMenuOption.REJECT:
        rejectRequest({ friendId });
        break;
      default:
        break;
    }
    setMenuVisible(false);
  };

  const triggerOptionCancelRequest = (option: ECancelMenuOption) => {
    switch (option) {
      case ECancelMenuOption.CANCEL:
        rejectRequest({ friendId });
        break;
      default:
        break;
    }
    setMenuVisible(false);
  };

  const getMenuOptions = () => {
    return [
      {
        label: EMenuOption.REMOVE,
        value: EMenuOption.REMOVE,
        icon: <Ionicons name="trash-outline" size={18} color={Colors.red[600]} />,
      },
    ];
  };

  const getMenuOptionsCancel = () => {
    return [
      {
        label: ECancelMenuOption.CANCEL,
        value: ECancelMenuOption.CANCEL,
        icon: <Ionicons name="close" size={18} color={Colors.red[600]} />,
      },
    ];
  };

  const getMenuOptionsIncomingRequest = () => {
    return [
      {
        label: EIncomingMenuOption.ACCEPT,
        value: EIncomingMenuOption.ACCEPT,
        icon: <Ionicons name="checkmark-circle" size={18} color={Colors.green[600]} />,
      },
      {
        label: EIncomingMenuOption.REJECT,
        value: EIncomingMenuOption.REJECT,
        icon: <Ionicons name="close-circle" size={18} color={Colors.red[600]} />,
      },
    ];
  };

  return (
    <ScrollView
      style={styles.root}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.topSection}></View>
      <View style={styles.profileContainer}>
        <TouchableWithoutFeedback onPress={pickImage}>
          <Image
            source={{
              uri: profileImage,
            }}
            style={styles.profileImage}
          />
        </TouchableWithoutFeedback>
        <LText style={styles.userName}>{profileInfo?.username}</LText>
      </View>
      <View style={styles.friendButtonContainer}>{renderFriendButtonBasedOnStatus()}</View>
      <View style={styles.userInformation}>
        <View style={styles.rankAndStreak}>
          <ChatStreakView currentStreak={profileInfo?.currentStreak} />
          <LText style={{ fontSize: 25, marginBottom: 0, marginRight: -2, fontWeight: 'bold' }}>
            {profileInfo?.globalRank}
          </LText>
          {/* <Ionicons name="trophy" size={30} color={Colors.yellow[600]} style={{ marginBottom: 4 }} /> */}
          <Image
            source={require('../../../../assets/gifs/icons8-trophy.gif')}
            style={{ width: 40, height: 40 }}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, gap: 15, display: 'flex', alignItems: 'center' }}>
        <ExperienceBarFromData data={profileInfo?.xp} isFetching={isProfileFetching} isError={isError} />
      </View>
      <Divider />
      <View style={styles.rowView}>
        <Title size="h4">English Level</Title>
        <LText style={{ fontSize: 16 }}>
          {profileInfo?.englishLevel === null
            ? capitalizeFirstLetter("Doesn't Know")
            : capitalizeFirstLetter(profileInfo?.englishLevel!)}
        </LText>
      </View>
      <Title size="h4">Hobbies</Title>
      <View style={styles.hobbyContainer}>
        <ReadOnlyItemGroup name="hobbies" items={hobbies} />
      </View>
    </ScrollView>
  );
};

const capitalizeFirstLetter = (string: string) => {
  if (string == null || string.length == 0) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {
    backgroundColor: Colors.primary[200],
    height: 100,
    width: '100%',
  },
  profileImage: {
    width: 130,
    height: 130,
    // marginTop: -130,
    borderRadius: 150 / 2,
    alignSelf: 'center',
    borderWidth: 6,
    borderColor: 'white',
  },
  profileContainer: {
    marginTop: -100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 20,
    gap: 14,
  },
  friendButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  userInformation: {
    marginVertical: 12,
    gap: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rankAndStreak: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 15,
  },
  hobbyContainer: {
    flex: 1,
    marginHorizontal: 0,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 55,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    maxWidth: '90%',
  },
  userDescription: {
    fontSize: 16,
  },
  activityContainer: {
    marginVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionText: {
    color: Colors.gray[0],
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  actionIcon: {
    color: Colors.gray[0],
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: 4,
    maxWidth: 250,
    shadowColor: 'black',

    // Shadow properties for iOS
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 3,

    // Shadow properties for Android
    elevation: 6,
  },
  actionSendRequest: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[100],
  },
  actionAlreadyFriend: {
    borderColor: Colors.green[600],
    backgroundColor: Colors.green[100],
  },
  actionPendingRequest: {
    borderColor: Colors.orange[700],
    backgroundColor: Colors.orange[400],
  },
  actionIncomingRequest: {
    borderColor: Colors.purple[700],
    backgroundColor: Colors.purple[200],
  },
  menuContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
});
export default FriendProfile;
