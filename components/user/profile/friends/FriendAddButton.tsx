import { StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.addFriendContainer}>
      <ActionIcon
        icon={<Ionicons name="add-circle-sharp" size={24} color={Colors.primary[500]} />}
        onPress={openAddFriendsScreen}
      />
      <LText style={styles.addFriendText} onPress={openAddFriendsScreen}>
        Add new friend
      </LText>
    </View>
  );
};

const styles = StyleSheet.create({
  addFriendContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFriendText: {
    color: Colors.primary[500],
    fontSize: 14,
  },
});

export default FriendAddButton;
