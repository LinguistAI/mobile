import IonIcons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import Colors from '../theme/colors';
import WordBankNavigation from './WordBankNavigation';
import ChatStackNavigator from './ChatStackNavigator';
import LeaderboardTabController from '../screens/leaderboard/LeaderBoardTabController';
import LeaderboardNavigator from './LeaderboardNavigator';
import { CopilotProvider } from 'react-native-copilot';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <CopilotProvider>
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
            tabBarIcon: ({ color, size }) => <IonIcons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <IonIcons name="chatbox-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="WordList"
          component={WordBankNavigation}
          options={{
            tabBarLabel: 'Word Bank',
            tabBarIcon: ({ color, size }) => <IonIcons name="book-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <IonIcons name="podium-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </CopilotProvider>
  );
};

export default BottomNavigation;
