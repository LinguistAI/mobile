import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type WalkthroughStep = {
  content: string | React.ReactNode;
  id: string;
  hide?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  triggerOnClose?: string;
  tooltipStyle?: StyleProp<ViewStyle>;
};

const useWalkthrough = (steps: WalkthroughStep[]) => {
  return null;
};

export default useWalkthrough;
