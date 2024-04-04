import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, Touchable, TouchableWithoutFeedback, View, ViewBase } from 'react-native';
import Colors from '../../theme/colors';
import useUser from '../../hooks/useUser';
import Button from '../../components/common/form/Button';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import UserInfoForm from './UserInfoForm';
import Divider from '../common/Divider';
import { useGetUserDetailsQuery } from './api';
import LoadingIndicator from '../common/LoadingIndicator';
import ExperienceBar from '../gamification/experience/ExperienceBar';
import ChatStreakContainer from '../gamification/streak/ChatStreakContainer';

const avatarPlaceholderImg = require('../../assets/profile-default.jpg');

const Profile = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState('https://thispersondoesnotexist.com');
  const { clearUserDetails, user } = useUser();

  const { data: userInfo, isFetching, error } = useGetUserDetailsQuery();

  const onChangePassword = () => {
    navigation.navigate('Change Password');
  };

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

  const handleSignout = async () => {
    clearUserDetails();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  const renderUserInfoForm = () => {
    if (isFetching) {
      return <LoadingIndicator />;
    }

    if (error || !userInfo) {
      return <Text>Something went wrong</Text>;
    }

    return <UserInfoForm userDetails={userInfo} />;
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.topSection} />
      <TouchableWithoutFeedback onPress={pickImage}>
        <Image
          source={{
            uri: profileImage,
          }}
          defaultSource={avatarPlaceholderImg}
          style={styles.profileImage}
        />
      </TouchableWithoutFeedback>
      <View style={styles.userInformation}>
        <Text style={styles.userName}>{user.username}</Text>
      </View>
      <View style={{ paddingHorizontal: 20, gap: 15, display: 'flex', alignItems: 'center' }}>
        <ExperienceBar />
        <ChatStreakContainer />
      </View>
      <Divider />
      {renderUserInfoForm()}
      <Divider />
      <View style={styles.changePasswordView}>
        <Button
          rightIcon={<Ionicons name="exit-outline" size={20} color={Colors.gray[0]} />}
          type="primary"
          onPress={handleSignout}
        >
          Sign Out
        </Button>
      </View>
      <View style={styles.changePasswordView}>
        <Button type="outlined" onPress={onChangePassword}>
          Change Password
        </Button>
      </View>

      <View style={styles.activityContainer}>
        <Text style={styles.activityTitle}>Activity</Text>
        <Text style={styles.lastLogin}>Last login: {user.lastLogin.toLocaleString()}</Text>
      </View>
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
export default Profile;
