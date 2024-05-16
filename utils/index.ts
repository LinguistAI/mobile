import notifee, { AndroidImportance } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export const formatAsStr = (input: string | string[]): string => {
  if (Array.isArray(input)) {
    return input.join(', ');
  } else {
    return input;
  }
};

export const updateArrayAtIndex = (arr: any[], index: number, val: any) => {
  return [...arr.slice(0, index), val, ...arr.slice(index + 1)];
};

/**
 * Converts milliseconds to seconds.
 *
 * @param {number} ms - The number of milliseconds.
 * @param {boolean} [pretty=false] - If true, rounds the result down to the nearest whole number.
 * @returns {number} The number of seconds equivalent to the input milliseconds.
 */
export const msToSeconds = (ms: number, pretty = false) => {
  let seconds = ms / 1000;
  if (pretty) {
    seconds = Math.floor(seconds);
  }

  return seconds;
};

export async function onDisplayNotification(message: FirebaseMessagingTypes.RemoteMessage) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH, // Set importance to high
  });

  // Display a notification
  await notifee.displayNotification({
    title: message.notification?.title ?? 'Notification Title',
    body: message.notification?.body ?? 'Main body content of the notification',
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      // iOS specific options
      sound: 'default',
      critical: true,
    },
  });
}
