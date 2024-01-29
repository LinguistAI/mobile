import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/user/ProfileScreen";
import SettingsScreen from "../screens/user/SettingsScreen";
import HomeScreen from "../screens/home/HomeScreen";
import WordListsScreen from "../screens/word-list/WordListsScreen";
import WordListDetailsScreen from "../screens/word-list/WordListDetailsScreen";

const WordBank = createNativeStackNavigator();

const WordBankNavigation = () => {
  return (
    <WordBank.Navigator initialRouteName="HomeTab">
      <WordBank.Screen
        name="Word Lists"
        component={WordListsScreen}
        options={{ headerShown: false }} // keep the header hidden for HomeTab
      />
      <WordBank.Screen
        name="Word List Details"
        component={WordListDetailsScreen}
        options={{ headerShown: true }} // enable header (with back option) for Profile
      />
    </WordBank.Navigator>
  );
};

export default WordBankNavigation;
