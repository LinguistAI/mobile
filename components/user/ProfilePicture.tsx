import { useGetProfilePictureQuery, useSetProfilePictureMutation } from "./userApi";
import {ActivityIndicator, Image, StyleSheet, TouchableWithoutFeedback} from "react-native";
import React, { useState, useEffect } from 'react';
import * as ImagePicker from "expo-image-picker";
import Colors from "../../theme/colors";
import useNotifications from "../../hooks/useNotifications";

interface ProfilePictureProps {
  username: string;
}

const ProfilePicture = ({ username }: ProfilePictureProps) => {
  const {
    data: profileImageData,
    isFetching: isProfilePictureFetching,
    refetch: profilePictureRefetch,
  } = useGetProfilePictureQuery(username);

  const [mutateProfilePicture, { isError: isProfilePictureError, error: profilePictureError, isLoading: isProfilePictureLoadingMutation }] =
    useSetProfilePictureMutation();

  const [profileImage, setProfileImage] = useState(profileImageData);

  useEffect(() => {
    if (profileImageData) {
      setProfileImage(profileImageData);
    }
  }, [profileImageData]);

  const { add, remove } = useNotifications();

  const uploadImage = async (base64) => {
    try {
      const uploadNotificationId = add({
        type: 'info',
        body: 'Uploading profile picture...',
        time: 50000,
      });

      const response = await mutateProfilePicture(
        {
          username: username,
          picture: {
            body: base64
          }
        }
      );

      remove(uploadNotificationId);
      add({
        type: 'success',
        body: 'Uploaded profile picture.',
        time: 2500,
      });
    }
    catch (error) {
      add({
        type: 'error',
        body: 'Could not upload profile picture.',
        time: 3000,
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.25,
      base64: true,
    });

    if (!result.canceled) {
      // Update profile picture locally
      setProfileImage(result.assets[0].uri);
      await uploadImage(result.assets[0].base64);
    }
  };

  if (isProfilePictureFetching) {
    return (
      <ActivityIndicator size={90} style={styles.profileImage} color={Colors.gray[900]} />
    );
  }

  return (
    <TouchableWithoutFeedback onPress={pickImage}>
      <Image
        source={{ uri: profileImage }}
        style={styles.profileImage}
        resizeMode="cover"
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
