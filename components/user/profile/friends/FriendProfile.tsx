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
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGetFriendProfileQuery, useRemoveFriendMutation } from '../../userApi';
import Colors from '../../../../theme/colors';
import Divider from '../../../common/Divider';
import ExperienceBarFromData from '../../../gamification/experience/ExperienceBarFromData';
import ChatStreakView from '../../../gamification/streak/ChatStreakView';
import LText from '../../../common/Text';
import Title from '../../../common/Title';
import ReadOnlyItemGroup from '../../../common/form/ReadOnlyItemGroup';
import { Ionicons } from '@expo/vector-icons';
import { FriendSearchFriendshipStatus } from '../../types';
import PopupMenu from './FriendshipCardOptionMenu';
import { EMenuOption } from './types';

const FriendProfile = () => {
  const [profileImage, setProfileImage] = useState('https://thispersondoesnotexist.com');
  const route = useRoute();
  const { friendId } = route.params;

  const [menuVisible, setMenuVisible] = useState(false);
  const [removeFriend] = useRemoveFriendMutation();

  const {
    data: profileInfo,
    isFetching: isProfileFetching,
    error: profileError,
    isError,
    refetch: profileRefetch,
  } = useGetFriendProfileQuery(friendId); // TODO update this with friend profile
  const [refreshing, setRefreshing] = useState(false);
  const friendshipStatus = FriendSearchFriendshipStatus.FRIEND;
  // const friendshipStatus = profileInfo?.friendshipStatus;

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

  const renderFriendsButton = () => {
    return (
      <View>
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={[styles.actionContainer, styles.actionAlreadyFriend]}
        >
          <LText style={styles.actionText}>Friends</LText>
          <Ionicons name="caret-down" size={22} color={Colors.green[800]} style={styles.actionIcon} />
        </Pressable>
        <PopupMenu
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
    return (
      <View>
        <Pressable onPress={handleFriendDropDown} style={[styles.actionContainer, styles.actionSendRequest]}>
          <Ionicons name="person-add" size={22} color={Colors.gray[0]} style={styles.actionIcon} />
          <LText style={styles.actionText}>Send Request</LText>
        </Pressable>
      </View>
    );
  };

  const renderAcceptRequestButton = () => {
    return (
      <View>
        <Pressable
          onPress={handleFriendDropDown}
          style={[styles.actionContainer, styles.actionIncomingRequest]}
        >
          <LText style={styles.actionText}>Accept</LText>
          <Ionicons name="checkmark-circle" size={24} color={Colors.gray[0]} style={styles.actionIcon} />
        </Pressable>
      </View>
    );
  };

  const renderPendingRequestButton = () => {
    return (
      <View>
        <Pressable
          onPress={handleFriendDropDown}
          style={[styles.actionContainer, styles.actionPendingRequest]}
        >
          <LText style={styles.actionText}>Pending</LText>
          <Ionicons name="time" size={20} color={Colors.gray[0]} style={styles.actionIcon} />
        </Pressable>
      </View>
    );
  };

  const handleFriendDropDown = () => {};

  const renderFriendButtonBasedOnStatus = () => {
    switch (friendshipStatus) {
      case FriendSearchFriendshipStatus.FRIEND:
        return renderFriendsButton();
      case FriendSearchFriendshipStatus.NOT_EXIST:
        return renderSendRequestButton();
      case FriendSearchFriendshipStatus.REQUEST_RECEIVED:
        return renderAcceptRequestButton();
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

  const getMenuOptions = () => {
    return [
      {
        label: EMenuOption.REMOVE,
        value: EMenuOption.REMOVE,
        icon: <Ionicons name="trash-outline" size={18} color={Colors.red[600]} />,
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
        <LText style={styles.userName}>{profileInfo?.name}</LText>
      </View>
      <View style={styles.friendButtonContainer}>{renderFriendButtonBasedOnStatus()}</View>
      <View style={styles.userInformation}>
        <View style={styles.rankAndStreak}>
          <ChatStreakView currentStreak={profileInfo?.currentStreak} />
          <LText style={{ fontSize: 25, marginBottom: 0, marginRight: 2, fontWeight: 'bold' }}>
            {profileInfo?.globalRank}
          </LText>
          <Ionicons name="trophy" size={30} color={Colors.yellow[600]} style={{ marginBottom: 4 }} />
          {/* </View> */}
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
    height: 130,
    width: '100%',
  },
  profileImage: {
    width: 150,
    height: 150,
    // marginTop: -130,
    borderRadius: 150 / 2,
    alignSelf: 'center',
    borderWidth: 6,
    borderColor: 'white',
  },
  profileContainer: {
    marginTop: -130,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    // borderWidth: 2,
    // borderColor: 'red',
    padding: 20,
    gap: 25,
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
