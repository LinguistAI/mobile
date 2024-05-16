import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';

const useDeviceToken = () => {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

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

  const getDeviceToken = async () => {
    const enabled = await requestUserPermission();
    if (!enabled) {
      return;
    }

    const token = await messaging().getToken();
    setDeviceToken(token);
  };

  useEffect(() => {
    getDeviceToken();
  }, []);

  return deviceToken;
};

export default useDeviceToken;
