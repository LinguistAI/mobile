import { NativeScrollEvent } from 'react-native';

export const isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
  const paddingToRight = 30;
  return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToRight;
};
export const isAwayFromLeft = ({ contentOffset }: NativeScrollEvent) => {
  return contentOffset.x > 10;
};
