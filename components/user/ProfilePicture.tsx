import { useGetProfilePictureQuery, useSetProfilePictureMutation } from "./userApi";
import { Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useState } from 'react';
import { AWS_PROFILE_PICTURE_UPLOAD_ENDPOINT } from "../../utils/aws";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../theme/colors";
import useNotifications from "../../hooks/useNotifications";

interface ProfilePictureProps {
  username: string;
}

const avatarPlaceholderImg = require('../../assets/profile-default.jpg');

const ProfilePicture = ({ username }: ProfilePictureProps) => {
  const {
    data: profileImageData,
    isLoading: isProfilePictureLoading,
    refetch: profilePictureRefetch,
  } = useGetProfilePictureQuery(username);

  const [mutateProfilePicture, { isError: isProfilePictureError, error: profilePictureError, isLoading: isProfilePictureLoadingMutation }] =
    useSetProfilePictureMutation();

  const [profileImage, setProfileImage] = useState(profileImageData);

  const { add, remove } = useNotifications();

  useFocusEffect(
    React.useCallback(() => {
      profilePictureRefetch();
    }, [profilePictureRefetch])
  );

  const uploadImage2 = async (base64) => {
    try {
      const uploadNotificationId = add({
        type: 'info',
        body: 'Uploading profile picture...',
        time: 50000,
      });

      const response = await mutateProfilePicture(
        username,
        JSON.stringify({
          body: base64
        })
      );

      console.log(response);

      remove(uploadNotificationId);
      add({
        type: 'success',
        body: 'Uploaded profile picture.',
        time: 2500,
      });
    } catch (error) {
      add({
        type: 'error',
        body: 'Could not upload profile picture.',
        time: 3000,
      });
    }
  };

  const uploadImage = async (base64) => {
    try {
      const response = await fetch(`${AWS_PROFILE_PICTURE_UPLOAD_ENDPOINT}?key=${username}.png`, {
        method: 'POST',
        body: JSON.stringify({
          body: base64
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const jsonResponse = await response.json();
    } catch (error) {
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      // Update profile picture locally
      setProfileImage(result.assets[0].uri);
      await uploadImage2(result.assets[0].base64);
    }
  };

  if (isProfilePictureLoading) {
    return (
      <Image
        source={avatarPlaceholderImg}
        style={styles.profileImage}
      />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={pickImage}>
      <Image
        source={{
          uri: profileImage,
        }}
        style={styles.profileImage}
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    backgroundColor: Colors.gray[200],
    width: 130,
    height: 130,
    borderRadius: 150 / 2,
    alignSelf: 'center',
    borderWidth: 6,
    borderColor: 'white',
  },
});

export default ProfilePicture;
