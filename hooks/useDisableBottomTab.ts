import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export const useDisableBottomTab = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  return null;
};
