import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationsScreen from '../screens/chat/ConversationsScreen';
import ChatBotsScreen from '../screens/chat/ChatBotsScreen';
import ChatScreen from '../screens/chat/ChatScreen';

const ChatStack = createNativeStackNavigator();

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator initialRouteName="Conversations">
      <ChatStack.Screen name="Conversations" component={ConversationsScreen} options={{ headerShown: false }} />
      <ChatStack.Screen
        name="ChatBotsListScreen"
        component={ChatBotsScreen}
        options={{ headerShown: true, headerTitle: 'Chat Bots' }}
      />
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
    </ChatStack.Navigator>
  );
};

export default ChatStackNavigator;
