import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import useUser from '../../../hooks/useUser';
import Colors from '../../../theme/colors';
import Divider from '../../common/Divider';
import Button from '../../common/form/Button';
import ChatStreakContainer from '../../gamification/streak/ChatStreakContainer';
import UserInfoForm from '../onboarding/UserInfoForm';
import { useGetProfileQuery, useGetUserDetailsQuery } from '../userApi';
import ActionIcon from '../../common/ActionIcon';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';
import FetchError from '../../common/feedback/FetchError';
import LText from '../../common/Text';
import UserExperienceBar from '../../gamification/experience/UserExperienceBar';

const avatarPlaceholderImg = require('../../../assets/profile-default.jpg');

const Profile = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState('https://thispersondoesnotexist.com');
  const { clearUserDetails, user } = useUser();

  const {
    data: userInfo,
    isLoading: isUserInfoFetching,
    error,
    refetch: userInfoRefetch,
  } = useGetUserDetailsQuery();
  const {
    data: profileInfo,
    isLoading: isProfileFetching,
    error: profileError,
    refetch: profileRefetch,
  } = useGetProfileQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onChangePassword = () => {
    navigation.navigate('Change Password');
  };

  const onPressFriends = () => {
    navigation.navigate('Friends');
  };

  useFocusEffect(
    React.useCallback(() => {
      userInfoRefetch();
      profileRefetch();
    }, [userInfoRefetch, profileRefetch])
  );

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
    await userInfoRefetch();
    await profileRefetch();
    setRefreshing(false);
  }, [userInfoRefetch, profileRefetch]);

  const handleSignout = async () => {
    clearUserDetails();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  const renderUserInfoForm = () => {
    if (isUserInfoFetching || isProfileFetching) {
      return <LoadingIndicator subtext="Gathering your info..." />;
    }

    if (error || profileError || !userInfo || !profileInfo) {
      return <FetchError withNavigation={false} />;
    }

    return <UserInfoForm userDetails={userInfo} profileDetails={profileInfo} />;
  };

  return (
    <ScrollView
      style={styles.root}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.topSection}>
        <View style={{ alignSelf: 'flex-end', margin: 15 }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>Friends</Text>
            <ActionIcon
              onPress={onPressFriends}
              icon={<Ionicons name="people-circle-outline" size={36} color={'black'} />}
            />
          </View>
        </View>
      </View>
      <View style={styles.profileContainer}>
        <TouchableWithoutFeedback onPress={pickImage}>
          <Image
            source={{
              uri: profileImage,
            }}
            style={styles.profileImage}
          />
        </TouchableWithoutFeedback>
        <LText style={styles.userName}>{user.username}</LText>
      </View>
      <View style={styles.rankAndStreak}>
        <ChatStreakContainer />
        <UserExperienceBar />
      </View>
      <Divider />
      {renderUserInfoForm()}
      <Divider />
      <View style={styles.changePasswordView}>
        <Button
          rightIcon={<Ionicons name="exit-outline" size={20} color={Colors.gray[0]} />}
          type="primary"
          onPress={handleSignout}
          color="red"
        >
          Sign Out
        </Button>
      </View>
      <View style={styles.changePasswordView}>
        <Button type="outlined" onPress={onChangePassword} color="red">
          Change Password
        </Button>
      </View>

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
    height: 120,
    width: '100%',
  },
  profileImage: {
    width: 130,
    height: 130,
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
  userInformation: {
    marginVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  rankAndStreak: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
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
export default Profile;
