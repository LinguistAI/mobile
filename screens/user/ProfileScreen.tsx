import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SecondaryButton from "../../components/common/form/SecondaryButton";
import Colors from "../../theme/colors";
import ActionButton from "../../components/common/ActionButton";
import { Ionicons } from "@expo/vector-icons";
import useUser from "../../hooks/useUser";
import Button from "../../components/common/form/Button";

const avatarPlaceholderImg = require("../../assets/profile-default.jpg");

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen = (props: ProfileScreenProps) => {
  const [profileImage, setProfileImage] = useState(
    "https://thispersondoesnotexist.com"
  );
  const { clearUserDetails } = useUser();

  const onChangePassword = () => {
    props.navigation.navigate("Change Password");
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
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  };

  return (
    <View>
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
        <Text style={styles.userName}>Tolga Özgün</Text>
        <Text style={styles.userDescription}>A mantra goes here</Text>
      </View>
      <View style={styles.changePasswordView}>
        <Button
          type="outlined"
          onPress={handleSignout}
        >
          Sign Out
        </Button>
      </View>
      <View style={styles.changePasswordView}>
        <Button 
          type="outlined"
          onPress={onChangePassword}>
          Change Password
        </Button>
      </View>

      <View style={styles.activityContainer}>
        <Text style={styles.activityTitle}>Activity</Text>
        <Text style={styles.activityNotFound}>No activity found</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: Colors.primary[200],
    height: 200,
    width: "100%",
  },
  profileImage: {
    width: 200,
    height: 200,
    marginTop: -130,
    borderRadius: 200 / 2,
    alignSelf: "center",
    borderWidth: 6,
    borderColor: "white",
  },
  userInformation: {
    marginTop: 16,
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userDescription: {
    fontSize: 16,
  },
  activityContainer: {
    marginTop: 32,
    alignItems: "center",
    gap: 8,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  activityNotFound: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  changePasswordView: {
    width: 250,
    height: 80,
    alignSelf: "center",
  },
});
export default ProfileScreen;
