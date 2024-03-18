import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordListsScreen from '../screens/word-list/WordListsScreen';
import WordListDetailsScreen from '../screens/word-list/WordListDetailsScreen';

const WordBank = createNativeStackNavigator();

const WordBankNavigation = () => {
  return (
    <WordBank.Navigator>
      <WordBank.Screen name="WordLists" component={WordListsScreen} options={{ headerShown: false }} />
      <WordBank.Screen name="WordListDetails" component={WordListDetailsScreen} />
    </WordBank.Navigator>
  );
};

export default WordBankNavigation;
