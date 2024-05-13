import { StyleSheet, Text, View } from 'react-native';
import FriendsList from '../../components/user/profile/friends/FriendsList';
import FriendAddButton from '../../components/user/profile/friends/FriendAddButton';

const FriendsScreen = () => {
  return (
    <View>
      <View style={styles.friendAddBtnContainer}>
        <FriendAddButton />
      </View>
      <FriendsList />
    </View>
  );
};

const styles = StyleSheet.create({
  friendAddBtnContainer: {
    alignSelf: 'center',
    marginVertical: 15,
  },
});

export default FriendsScreen;
