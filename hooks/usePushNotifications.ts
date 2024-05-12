import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import useUser from './useUser';

const usePushNotifications = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    return enabled;
  }

  useEffect(() => {
    const handleInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('Initial notification:', initialNotification);
      }
    };

    handleInitialNotification();
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      if (remoteMessage.data.default.type === 'DailyQuestNotification') {
        if (user) {
          navigation.navigate('HomeTab');
        }
      }
    });

    const unsubscribeFromNotificationOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage);
    });

    return () => {
      unsubscribe();
      unsubscribeFromNotificationOpenedApp();
    };
  }, []);

  requestUserPermission();

  return null;
};

export default usePushNotifications;
