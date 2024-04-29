import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/user/ProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HomeScreen from '../screens/home/HomeScreen';
import FriendsScreen from '../screens/user/FriendsScreen';
import FriendAddScreen from '../components/user/profile/friends/FriendAddScreen';
import FriendTabController from '../screens/user/FriendTabController';
import FriendProfileScreen from '../screens/user/FriendProfileScreen';
import LeaderboardTabController from '../screens/leaderboard/LeaderBoardTabController';

const HomeStack = createNativeStackNavigator();

const LeaderboardNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="HomeTab">
      <HomeStack.Screen
        name="Leaderboards"
        component={LeaderboardTabController}
        options={{ headerShown: false, headerTitle: 'Leaderboards' }}
      />
      <HomeStack.Screen
        name="FriendProfileFromLeaderboard"
        component={FriendProfileScreen}
        options={{ headerShown: true, headerTitle: 'Profile' }}
      />
    </HomeStack.Navigator>
  );
};

export default LeaderboardNavigator;
