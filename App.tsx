import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { atom } from "jotai";
import { SafeAreaView } from "react-native";
import Notifications from "./components/notifications/Notifications";
import BottomNavigation from "./navigation/BottomNavigation";
import ChangePasswordScreen from "./screens/common/auth/ChangePasswordScreen";
import LoginScreen from "./screens/common/auth/LoginScreen";
import RegisterScreen from "./screens/common/auth/RegisterScreen";
import ForgotPasswordCodeScreen from "./screens/common/auth/forgot-password/ForgotPasswordCodeScreen";
import ForgotPasswordNewPasswordScreen from "./screens/common/auth/forgot-password/ForgotPasswordNewPasswordScreen";
import ForgotPasswordScreen from "./screens/common/auth/forgot-password/ForgotPasswordScreen";
import LandingScreen from "./screens/common/LandingScreen";
import { CustomErrorBoundary } from "./screens/errors/ErrorBoundary";
import { MenuProvider } from "react-native-popup-menu";
import PostRegistrationConversation from "./components/user/PostRegistrationConversation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider>
        <CustomErrorBoundary>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                contentStyle: {
                  backgroundColor: "white",
                },
              }}
              initialRouteName="Login"
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
              <Stack.Screen
                name="Forgot Password"
                component={ForgotPasswordScreen}
              />
              <Stack.Screen
                name="Forgot Password Code"
                component={ForgotPasswordCodeScreen}
              />
              <Stack.Screen
                name="New Password"
                component={ForgotPasswordNewPasswordScreen}
              />
              <Stack.Screen
                name="Change Password"
                component={ChangePasswordScreen}
              />
            </Stack.Navigator>
            <Notifications />
          </NavigationContainer>
        </CustomErrorBoundary>
      </MenuProvider>
    </QueryClientProvider>
  );
}
