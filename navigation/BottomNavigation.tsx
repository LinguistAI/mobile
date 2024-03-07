import IonIcons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/chat/ChatScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import HomeStackNavigator from './HomeStackNavigator';
import Colors from '../theme/colors';
import WordBankNavigation from './WordBankNavigation';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import ConversationsScreen from '../screens/chat/ConversationsScreen';
import ChatStackNavigator from './ChatStackNavigator';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Provider store={store}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary['600'],
        }}
      >
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
          component={ChatStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <IonIcons name="chatbox-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="WordList"
          component={WordBankNavigation}
          options={{
            tabBarLabel: 'Word Bank',
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
    </Provider>
  );
};

export default BottomNavigation;
