import { atom, useAtom } from 'jotai';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export type NotificationObject = {
  body: string;
  title?: string;
  bodyColor?: string;
  titleColor?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  time?: number; // ms
  id?: string;
};

const notificationsAtom = atom<NotificationObject[]>([]);

const defaultTime = 500;
const defaultType = 'info';

const useNotifications = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  function add(notification: NotificationObject) {
    const randomId = uuidv4();

    const id = notification.id || randomId;
    const time = notification.time || defaultTime;
    const type = notification.type || defaultType;

    const newNotification = { ...notification, id, type, time };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      remove(id);
    }, time);

    return id;
  }

  function remove(): void;
  function remove(id: string): void;
  function remove(id?: string): void {
    if (id) {
      // Remove the notification with the given id
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      // Remove the oldest notification
      setNotifications((prev) => prev.slice(1));
    }
  }

  function clear() {
    setNotifications([]);
  }

  return { notifications, add, remove, clear };
};

export default useNotifications;
