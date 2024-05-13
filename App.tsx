import { Nunito_400Regular, Nunito_700Bold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ScreenOrientation from 'expo-screen-orientation';
import { createContext, useEffect } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import Splash from './components/common/feedback/Splash';
import Notifications from './components/notifications/Notifications';
import PostRegistrationConversation from './components/user/onboarding/PostRegistrationConversation';
import BottomNavigation from './navigation/BottomNavigation';
import { store } from './redux/store';
import LandingScreen from './screens/common/LandingScreen';
import ChangePasswordScreen from './screens/common/auth/ChangePasswordScreen';
import LoginScreen from './screens/common/auth/LoginScreen';
import RegisterScreen from './screens/common/auth/RegisterScreen';
import ForgotPasswordCodeScreen from './screens/common/auth/forgot-password/ForgotPasswordCodeScreen';
import ForgotPasswordNewPasswordScreen from './screens/common/auth/forgot-password/ForgotPasswordNewPasswordScreen';
import ForgotPasswordScreen from './screens/common/auth/forgot-password/ForgotPasswordScreen';
import { CustomErrorBoundary } from './screens/errors/ErrorBoundary';
import Colors from './theme/colors';
import messaging from '@react-native-firebase/messaging';
import { CopilotProvider } from 'react-native-copilot';
import usePushNotifications from './hooks/usePushNotifications';
import useDeviceToken from './hooks/useDeviceToken';
import useUser from './hooks/useUser';
import PushNotificationWrapper from './components/PushNotificationWrapper';
import Modals from './components/modals/Modals';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export const FontLoadedContext = createContext<boolean>(false);

export default function App() {
  const token = useDeviceToken();
  console.log('token', token);

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
      console.log('Loading fonts');
      return <Splash />;
    }
  } catch (error) {
    console.log('Could not load fonts', error);
  }

  console.log('Fonts loaded');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CopilotProvider>
            <AutocompleteDropdownContextProvider>
              <MenuProvider>
                <CustomErrorBoundary>
                  <NavigationContainer>
                    <SafeAreaView style={styles.root}>
                      <PushNotificationWrapper>
                        <Modals />
                        <StatusBar />
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
                      </PushNotificationWrapper>
                    </SafeAreaView>
                  </NavigationContainer>
                </CustomErrorBoundary>
                <Notifications />
              </MenuProvider>
            </AutocompleteDropdownContextProvider>
          </CopilotProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background[500],
  },
});
