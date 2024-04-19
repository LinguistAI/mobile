import { StyleSheet, Text, View } from 'react-native';
import LeaderboardList from './LeaderboardList';

const FriendsLeaderboardScreen = () => {
  return (
    <View>
      <LeaderboardList />
    </View>
  );
};

const styles = StyleSheet.create({
  friendAddBtnContainer: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});
export default FriendsLeaderboardScreen;
