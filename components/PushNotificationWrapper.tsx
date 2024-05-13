import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import useUser from '../hooks/useUser';
import { useDispatch } from 'react-redux';
import { setQuestReminderModalOpen } from '../redux/chatSlice';
import { Notifications } from 'react-native-notifications';
import { onDisplayNotification } from '../utils';

interface PushNotificationWrapperProps {
  children: React.ReactNode;
}

const PushNotificationWrapper = ({ children }: PushNotificationWrapperProps) => {
  const { user } = useUser();
  const dispatch = useDispatch();

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
      onDisplayNotification(remoteMessage);

      const defaultData = JSON.parse(remoteMessage?.data?.default);
      if (defaultData?.type === 'DailyQuestNotification') {
        if (user) {
          dispatch(setQuestReminderModalOpen(true));
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

  return children;
};

export default PushNotificationWrapper;
