import { StyleSheet, View } from 'react-native';
import Animated, { FadeInLeft, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';
import useNotifications from '../../hooks/useNotifications';
import Notification from './Notification';
import { useSwipe } from '../../hooks/useSwipe';
import { useState } from 'react';

const Notifications = () => {
  const { notifications, remove } = useNotifications();

  const onSwipeLeft = (id: string) => {
    handleRemove(id);
  };

  const onSwipeRight = (id: string) => {
    handleRemove(id);
  };

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight);

  const handleRemove = (id: string) => {
    remove(id);
  };

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <Animated.View
          key={notification.id}
          entering={FadeInLeft}
          exiting={FadeOutLeft.duration(400)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Notification notification={notification} handleRemove={handleRemove} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 20,
    bottom: 10,
    left: 0,
    right: 0,
    gap: 12,
  },
});

export default Notifications;
