import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../../theme/colors';
import ActionIcon from '../../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import LText from '../../../common/Text';

const FriendAddButton = () => {
  const navigation = useNavigation();

  const openAddFriendsScreen = () => {
    navigation.navigate('FriendAdd');
  };

  return (
    <Pressable onPress={openAddFriendsScreen}>
      <View style={styles.addFriendContainer}>
        <ActionIcon
          icon={<Ionicons name="add-circle-sharp" size={24} color={Colors.primary[500]} />}
          onPress={openAddFriendsScreen}
        />
        <LText style={styles.addFriendText} onPress={openAddFriendsScreen}>
          Add new friend
        </LText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addFriendContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary[500],
    backgroundColor: Colors.gray[0],
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
    shadowColor: 'black',

    // Shadow properties for iOS
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 4,

    // Shadow properties for Android
    elevation: 7,

    marginBottom: 5,
  },
  addFriendText: {
    color: Colors.primary[500],
    fontSize: 14,
  },
});

export default FriendAddButton;
