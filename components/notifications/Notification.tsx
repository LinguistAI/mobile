import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import ActionIcon from '../common/ActionIcon';
import useNotifications, { NotificationObject } from '../../hooks/useNotifications';
import Colors from '../../theme/colors';
import { useSwipe } from '../../hooks/useSwipe';
import React from 'react';
import LText from '../common/Text';
interface NotificationProps {
  notification: NotificationObject;
  handleRemove: (id: string) => void;
}

const Notification = (props: NotificationProps) => {
  const { notification, handleRemove } = props;

  const getNotificationBgStyle = () => {
    switch (notification.type) {
      case 'info':
        return styles.infoBgColor;
      case 'success':
        return styles.successBgColor;
      case 'error':
        return styles.errorBgColor;
      case 'warning':
        return styles.warningBgColor;
      default:
        return styles.infoBgColor;
    }
  };

  return (
    <View style={[styles.container, getNotificationBgStyle()]}>
      <View style={styles.notificationCard}>
        <View>
          {notification.title ? (
            <Text style={[styles.title, { color: notification?.titleColor }]}>{notification.title}</Text>
          ) : null}
          <Text
            style={[
              styles.body,
              { color: notification?.bodyColor ? notification?.bodyColor : Colors.gray[0] },
            ]}
          >
            {notification.body}
          </Text>
        </View>
        <View style={styles.closeIcon}>
          <ActionIcon
            icon={<Ionicons name="close" size={24} color={Colors.gray[0]} />}
            onPress={() => handleRemove(notification?.id ?? '')}
          />
        </View>
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    borderRadius: 10,
    width: '100%',
    shadowColor: 'black',

    // Shadow properties for iOS
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 3,

    // Shadow properties for Android
    elevation: 6,
  },
  notificationCard: {
    paddingHorizontal: 12,
    paddingBottom: 3,
    paddingTop: 10,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  body: {
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: '98%',
    lineHeight: 22,
  },

  infoBgColor: {
    backgroundColor: Colors.blue[500],
  },
  successBgColor: {
    backgroundColor: Colors.green[500],
  },
  errorBgColor: {
    backgroundColor: Colors.red[600],
  },
  warningBgColor: {
    backgroundColor: Colors.yellow[500],
  },
  closeIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});
