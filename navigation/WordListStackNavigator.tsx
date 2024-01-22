import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WordListDetailsScreen from "../screens/word-list/WordListDetailsScreen";
import WordListsScreen from "../screens/word-list/WordListsScreen";

const WordListStackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="WordList">
      <Stack.Screen name="WordList" component={WordListsScreen} />
      <Stack.Screen name="WordDetail" component={WordListDetailsScreen} />
    </Stack.Navigator>
  );
};

export default WordListStackNavigator;
