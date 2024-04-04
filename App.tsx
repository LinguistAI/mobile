import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Notifications from './components/notifications/Notifications';
import BottomNavigation from './navigation/BottomNavigation';
import ChangePasswordScreen from './screens/common/auth/ChangePasswordScreen';
import LoginScreen from './screens/common/auth/LoginScreen';
import RegisterScreen from './screens/common/auth/RegisterScreen';
import ForgotPasswordCodeScreen from './screens/common/auth/forgot-password/ForgotPasswordCodeScreen';
import ForgotPasswordNewPasswordScreen from './screens/common/auth/forgot-password/ForgotPasswordNewPasswordScreen';
import ForgotPasswordScreen from './screens/common/auth/forgot-password/ForgotPasswordScreen';
import LandingScreen from './screens/common/LandingScreen';
import { CustomErrorBoundary } from './screens/errors/ErrorBoundary';
import { MenuProvider } from 'react-native-popup-menu';
import PostRegistrationConversation from './components/user/PostRegistrationConversation';
import { SafeAreaView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Colors from './theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export default function App() {
  const Stack = createNativeStackNavigator();
  ScreenOrientation.lockPlatformAsync({
    screenOrientationArrayIOS: [ScreenOrientation.Orientation.PORTRAIT_UP],
    screenOrientationConstantAndroid: ScreenOrientation.Orientation.PORTRAIT_UP,
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AutocompleteDropdownContextProvider>
          <MenuProvider>
            <CustomErrorBoundary>
              <NavigationContainer>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                  <Stack.Navigator
                    screenOptions={{
                      contentStyle: {
                        backgroundColor: Colors.background[500],
                      },
                    }}
                    initialRouteName="Landing"
                  >
                    <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen
                      name="Welcome Conversation"
                      component={PostRegistrationConversation}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Main" component={BottomNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
                    <Stack.Screen name="Forgot Password Code" component={ForgotPasswordCodeScreen} />
                    <Stack.Screen name="New Password" component={ForgotPasswordNewPasswordScreen} />
                    <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
                  </Stack.Navigator>
                </SafeAreaView>
              </NavigationContainer>
            </CustomErrorBoundary>
            <Notifications />
          </MenuProvider>
        </AutocompleteDropdownContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}
