import * as ImagePicker from 'expo-image-picker';
import React, { useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import useUser from '../../../../hooks/useUser';
import { useGetProfileQuery } from '../../userApi';
import Colors from '../../../../theme/colors';
import Divider from '../../../common/Divider';
import ExperienceBar from '../../../gamification/experience/ExperienceBar';
import ChatStreakContainer from '../../../gamification/streak/ChatStreakContainer';
import LoadingIndicator from '../../../common/feedback/LoadingIndicator';
import UserInfoForm from '../../onboarding/UserInfoForm';
import { IUserDetailedInfo } from '../../types';

// const avatarPlaceholderImg = require('../../../../assets/profile-default.jpg');

const FriendProfile = () => {
  const [profileImage, setProfileImage] = useState('https://thispersondoesnotexist.com');
  const { clearUserDetails, user } = useUser();
  const route = useRoute();
  const { friendId } = route.params;

  const {
    data: profileInfo,
    isFetching: isProfileFetching,
    error: profileError,
    refetch: profileRefetch,
  } = useGetProfileQuery(); // TODO update this with friend profile
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await profileRefetch();
    setRefreshing(false);
  }, [profileRefetch]);

  const renderUserInfoForm = () => {
    if (isProfileFetching) {
      return <LoadingIndicator />;
    }

    if (profileError || !profileInfo) {
      return <Text>Something went wrong</Text>;
    }
    const userDet: IUserDetailedInfo = {
      name: 'elogus',
      birthDate: 'January 9 2002',
      englishLevel: 'ADVANCED',
      hobbies: ['Swimming'],
    };
    return <UserInfoForm userDetails={userDet} profileDetails={profileInfo} />;
  };

  return (
    <ScrollView
      style={styles.root}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.topSection}>
        <View style={{ alignSelf: 'flex-end', margin: 15 }}></View>
      </View>
      {/* <TouchableWithoutFeedback onPress={pickImage}>
        <Image
          source={{
            uri: profileImage,
          }}
          defaultSource={avatarPlaceholderImg}
          style={styles.profileImage}
        />
      </TouchableWithoutFeedback> */}
      <View style={styles.userInformation}>
        <Text style={styles.userName}>{user.username}</Text>
      </View>
      <View style={{ paddingHorizontal: 20, gap: 15, display: 'flex', alignItems: 'center' }}>
        <ExperienceBar />
        <ChatStreakContainer />
      </View>
      <Divider />
      {renderUserInfoForm()}

      {user.lastLogin && (
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Activity</Text>
          <Text style={styles.lastLogin}>Last login: {user.lastLogin.toLocaleString()}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {
    backgroundColor: Colors.primary[200],
    height: 200,
    width: '100%',
  },
  profileImage: {
    width: 200,
    height: 200,
    marginTop: -130,
    borderRadius: 200 / 2,
    alignSelf: 'center',
    borderWidth: 6,
    borderColor: 'white',
  },
  userInformation: {
    marginVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
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
  lastLogin: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  changePasswordView: {
    width: 250,
    height: 80,
    alignSelf: 'center',
  },
});
export default FriendProfile;
