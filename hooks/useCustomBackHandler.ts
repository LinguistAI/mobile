import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const useCustomBackHandler = (handler: () => boolean) => {
  useEffect(() => {
    const backAction = () => {
      return handler();
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [handler]);
};

export default useCustomBackHandler;
