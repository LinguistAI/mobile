import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WordListsScreen from "../screens/word-list/WordListsScreen";
import WordListDetailsScreen from "../screens/word-list/WordListDetailsScreen";

const WordBank = createNativeStackNavigator();

const WordBankNavigation = () => {
  return (
    <WordBank.Navigator initialRouteName="HomeTab">
      <WordBank.Screen
        name="WordLists"
        component={WordListsScreen}
        options={{ headerShown: false }} // keep the header hidden for HomeTab
      />
      <WordBank.Screen
        name="WordList Details"
        component={WordListDetailsScreen}
        options={{ headerShown: true }} // enable header (with back option) for Profile
      />
    </WordBank.Navigator>
  );
};

export default WordBankNavigation;
