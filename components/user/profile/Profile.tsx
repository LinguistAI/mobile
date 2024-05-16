import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import useUser from '../../../hooks/useUser';
import Colors from '../../../theme/colors';
import ActionIcon from '../../common/ActionIcon';
import Divider from '../../common/Divider';
import LText from '../../common/Text';
import FetchError from '../../common/feedback/FetchError';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';
import Button from '../../common/form/Button';
import UserExperienceBar from '../../gamification/experience/UserExperienceBar';
import ChatStreakContainer from '../../gamification/streak/ChatStreakContainer';
import PrivacyPolicyModal from '../PrivacyPolicyModal';
import ProfilePicture from '../ProfilePicture';
import UserInfoForm from '../onboarding/UserInfoForm';
import { useDeleteAccountMutation, useGetProfileQuery, useGetUserDetailsQuery } from '../userApi';
import ConfirmDeleteModal from '../ConfirmDeleteModal';

const Profile = () => {
  const navigation = useNavigation();

  const { clearUserDetails, user } = useUser();
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteAccount] = useDeleteAccountMutation();


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

  const togglePrivacyPolicyModal = () => {
    setPrivacyPolicyVisible(!privacyPolicyVisible);
  };

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    clearUserDetails();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };


  useFocusEffect(
    React.useCallback(() => {
      userInfoRefetch();
      profileRefetch();
    }, [userInfoRefetch, profileRefetch])
  );

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

  const handleAccountDeletion = async () => {
    clearUserDetails();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  }

  

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
      {/* <View style={styles.topSection}>
        <View style={{ alignSelf: 'flex-end', margin: 15 }}></View>
      </View> */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.primary[200],
        }}
      >
        <View style={styles.profileContainer}>
          <ProfilePicture username={user.username} />
          <LText style={styles.userName}>{user.username}</LText>
        </View>

        <Pressable onPress={onPressFriends} style={{ paddingTop: 10, paddingRight: 10 }}>
          <ActionIcon
            onPress={onPressFriends}
            icon={
              <Ionicons style={{ paddingLeft: 5 }} name="people-circle-outline" size={36} color={'black'} />
            }
          />
          <Text style={{ fontWeight: 'bold' }}>Friends</Text>
        </Pressable>
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
        <Button
          rightIcon={<Ionicons name="trash-bin" size={20} color={Colors.gray[0]} />}
          type="primary"
          onPress={showDeleteModal}
          color="red"
        >
          Delete My Account
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
      <View style={styles.changePasswordView}>
        <Text style={styles.privacyPolicyText} onPress={togglePrivacyPolicyModal}>
          View Privacy Policy
        </Text>
      </View>
      <PrivacyPolicyModal visible={privacyPolicyVisible} onClose={togglePrivacyPolicyModal} />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onConfirm={handleDeleteAccount}
        onCancel={hideDeleteModal}
      />
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
    zIndex: 10000,
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
    // marginTop: 100,
    flex: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 20,
    gap: 14,
    zIndex: 10,
  },
  userInformation: {
    marginVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  rankAndStreak: {
    paddingTop: 20,
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
    marginTop: 20,
    marginBottom: 10,
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
  privacyPolicyText: {
    color: Colors.gray[600],
    fontSize: 16,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});
export default Profile;
