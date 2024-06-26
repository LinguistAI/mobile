import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoreScreen from '../screens/store/StoreScreen'

const Store = createNativeStackNavigator();

const StoreNavigation = () => {
  return (
    <Store.Navigator>
      <Store.Screen 
        name="Store" 
        component={StoreScreen}  
        options={{ headerShown: false }}
        />
    </Store.Navigator>
  );
};

export default StoreNavigation;