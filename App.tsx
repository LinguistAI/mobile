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
import PostRegistrationConversation from './components/user/onboarding/PostRegistrationConversation';
import { SafeAreaView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createContext } from 'react';
import Splash from './components/common/Splash';
import { useFonts, Nunito_400Regular, Nunito_700Bold, Nunito_900Black } from '@expo-google-fonts/nunito';
import Colors from './theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export const FontLoadedContext = createContext<boolean>(false);

export default function App() {
  const Stack = createNativeStackNavigator();
  ScreenOrientation.lockPlatformAsync({
    screenOrientationArrayIOS: [ScreenOrientation.Orientation.PORTRAIT_UP],
    screenOrientationConstantAndroid: ScreenOrientation.Orientation.PORTRAIT_UP,
  });

  try {
    let [fontsLoaded] = useFonts({
      Regular: Nunito_400Regular,
      SemiBold: Nunito_700Bold,
      Bold: Nunito_900Black,
    });

    if (!fontsLoaded) {
      return <Splash />;
    }
  } catch (error) {
    console.log('Could not load fonts', error);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AutocompleteDropdownContextProvider>
            <MenuProvider>
              <CustomErrorBoundary>
                <NavigationContainer>
                  <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <Stack.Navigator
                      screenOptions={{
                        contentStyle: {
                          backgroundColor: 'white',
                        },
                      }}
                      initialRouteName="Landing"
                    >
                      <Stack.Screen
                        name="Landing"
                        component={LandingScreen}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen name="Login" component={LoginScreen} />
                      <Stack.Screen name="Register" component={RegisterScreen} />
                      <Stack.Screen
                        name="Welcome Conversation"
                        component={PostRegistrationConversation}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="Main"
                        component={BottomNavigation}
                        options={{ headerShown: false }}
                      />
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
    </GestureHandlerRootView>
  );
}
