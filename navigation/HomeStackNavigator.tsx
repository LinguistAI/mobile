import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/user/ProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HomeScreen from '../screens/home/HomeScreen';
import FriendsScreen from '../screens/user/FriendsScreen';
import FriendAddScreen from '../components/user/profile/friends/FriendAddScreen';
import FriendTabController from '../screens/user/FriendTabController';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="HomeTab">
      <HomeStack.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ headerShown: false }} // keep the header hidden for HomeTab
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true }} // enable header (with back option) for Profile
      />
      <HomeStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: true }} // enable header (with back option) for Settings
      />
      <HomeStack.Screen name="Friends" component={FriendTabController} options={{ headerShown: true }} />
      <HomeStack.Screen
        name="FriendAdd"
        component={FriendAddScreen}
        options={{ headerShown: true, headerTitle: 'Add Friend' }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
