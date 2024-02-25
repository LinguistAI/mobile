import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WordListsScreen from "../screens/word-list/WordListsScreen";
import WordListDetailsScreen from "../screens/word-list/WordListDetailsScreen";

const WordBank = createNativeStackNavigator();

const WordBankNavigation = () => {
  return (
    <WordBank.Navigator>
      <WordBank.Screen
        name="WordLists"
        component={WordListsScreen}
        options={{ headerShown: false }}
      />
      <WordBank.Screen
        name="WordListDetails"
        component={WordListDetailsScreen}
        options={{ headerShown: true, headerTitle: "Word List" }}
      />
    </WordBank.Navigator>
  );
};

export default WordBankNavigation;
