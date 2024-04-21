import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuestsScreen from '../screens/quest/QuestsScreen'

const Quests = createNativeStackNavigator();

const QuestsNavigation = () => {
  return (
    <Quests.Navigator>
      <Quests.Screen name="Daily Quests" component={QuestsScreen} />
    </Quests.Navigator>
  );
};

export default QuestsNavigation;
