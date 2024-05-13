import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import useUser from '../hooks/useUser';
import { useDispatch } from 'react-redux';
import { setLevelUpModalConfig, setQuestReminderModalOpen } from '../redux/chatSlice';
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
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await onDisplayNotification(remoteMessage);

      if (!user) {
        return;
      }

      const defaultData = remoteMessage?.data?.default;
      if (defaultData?.type === 'DailyQuestNotification') {
        console.log('Daily quest notification received');
        dispatch(setQuestReminderModalOpen(true));
      } else if (remoteMessage?.data?.type === 'LevelUp') {
        console.log('Level up notification received');
        dispatch(
          setLevelUpModalConfig({
            previousLevel: parseInt(remoteMessage?.data?.previousLevel) || 0,
            newLevel: parseInt(remoteMessage?.data?.currentLevel) || 0,
            visible: true,
          })
        );
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
