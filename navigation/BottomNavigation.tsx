import IonIcons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../screens/chat/ChatScreen";
import LeaderboardScreen from "../screens/leaderboard/LeaderboardScreen";
import WordListsScreen from "../screens/word-list/WordListsScreen";
import HomeStackNavigator from "./HomeStackNavigator";

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons
              // onPress={{navigator.navigate('Chat')}}
              name="chatbox-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Word List"
        component={WordListsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons name="podium-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
