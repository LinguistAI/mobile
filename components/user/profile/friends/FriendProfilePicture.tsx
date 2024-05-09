import { useGetProfilePictureQuery } from "../../userApi";
import {ActivityIndicator, Image, StyleSheet, TouchableWithoutFeedback} from "react-native";
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../../../theme/colors";

interface ProfilePictureProps {
  username: string;
}

const FriendProfilePicture = ({ username }: ProfilePictureProps) => {
  const {
    data: profileImageData,
    isFetching: isProfilePictureFetching,
    refetch: profilePictureRefetch,
  } = useGetProfilePictureQuery(username);

  const [profileImage, setProfileImage] = useState(profileImageData);

  useEffect(() => {
    if (profileImageData) {
      setProfileImage(profileImageData);
    }
  }, [profileImageData]);

  useFocusEffect(
    React.useCallback(() => {
      profilePictureRefetch();
      setProfileImage(profileImageData);
    }, [profilePictureRefetch])
  );

  if (isProfilePictureFetching) {
    return (
      <ActivityIndicator size={90} style={styles.profileImage} color={Colors.gray[900]} />
    );
  }

  return (
    <TouchableWithoutFeedback>
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

export default FriendProfilePicture;
