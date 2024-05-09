import IonIcons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import Colors from '../theme/colors';
import WordBankNavigation from './WordBankNavigation';
import ChatStackNavigator from './ChatStackNavigator';
import LeaderboardNavigator from './LeaderboardNavigator';
import StoreNavigation from './StoreNavigation';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const ChatButton = ({ focused }) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('Chat');
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.mainButton]} activeOpacity={0.98}>
      <IonIcons
        name="chatbox-outline"
        size={28}
        color={focused ? Colors.primary['500'] : Colors.gray['600']}
      />
      <Text style={{ color: focused ? Colors.primary[600] : Colors.gray[600], fontSize: 10 }}>Chat</Text>
    </TouchableOpacity>
  );
};
const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary['600'],
      }}
      tabBar={({ state, descriptors, navigation }) => {
        const routes = state.routes;
        let hideTabBar = false;
        routes.forEach((route, index) => {
          if (route.name === 'Chat' && state.index === index) {
            hideTabBar = true;
          }
        });

        if (hideTabBar) {
          return null;
        }

        return (
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const focused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={[
                    styles.tabItem,
                    {
                      backgroundColor: Colors.gray['0'],
                    },
                  ]}
                  activeOpacity={route.name !== 'Chat' ? 0.98 : 1}
                >
                  {options.tabBarIcon({
                    focused: focused,
                    color: focused ? Colors.primary[600] : Colors.gray[600],
                    size: 24,
                  })}
                  {route.name === 'Chat' && <ChatButton focused={focused} />}
                  <Text style={{ color: focused ? Colors.primary[600] : Colors.gray[600], fontSize: 10 }}>
                    {options.tabBarLabel ?? route.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <IonIcons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="StoreTab"
        component={StoreNavigation}
        options={{
          tabBarLabel: 'Store',
          tabBarIcon: ({ color, size }) => <IonIcons name="pricetags-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IonIcons style={{ display: 'none' }} name="chatbox-outline" size={size} color={color} />
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="WordList"
        component={WordBankNavigation}
        options={{
          tabBarLabel: 'Word Bank',
          tabBarIcon: ({ color, size }) => <IonIcons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <IonIcons name="podium-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: Colors.gray['100'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    alignSelf: 'center',
    zIndex: 1,
  },
});

export default BottomNavigation;
