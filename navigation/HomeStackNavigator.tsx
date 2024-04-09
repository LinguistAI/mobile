import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/user/ProfileScreen';
import SettingsScreen from '../screens/user/SettingsScreen';
import HomeScreen from '../screens/home/HomeScreen';
import QuizController from '../components/quiz/QuizController';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="HomeTab">
      <HomeStack.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
