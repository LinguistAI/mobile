import * as SecureStore from 'expo-secure-store';
import { atom, useAtom } from 'jotai';
import { StoredUserInfoWithTokens } from '../types';

const emptyUserAtom = {
  username: '',
  email: '',
  accessToken: '',
  refreshToken: '',
  lastLogin: new Date('1970-01-01T00:00:00.000Z'),
  id: '',
};

const userAtom = atom<StoredUserInfoWithTokens>(emptyUserAtom);

const useUser = () => {
  const [user, setUser] = useAtom(userAtom);

  const storeUser = async (details: StoredUserInfoWithTokens) => {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(details));
      setUser(details);
    } catch (error) {
      // TODO: Handle error
      console.error('Error storing user details: ', error);
    }
  };

  const getUser = async () => {
    try {
      const userDetails = await SecureStore.getItemAsync('user');
      if (userDetails !== null) {
        setUser(JSON.parse(userDetails));
      }
    } catch (error) {
      // TODO: Handle error
      console.error('Error retrieving user details: ', error);
    }
  };

  const clearUser = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(emptyUserAtom);
    } catch (error) {
      // TODO: Handle error
      console.error('Error clearing user details: ', error);
    }
  };

  const updateUserLoginDate = async () => {
    try {
      const userDetails = await SecureStore.getItemAsync('user');
      if (userDetails !== null) {
        const details = JSON.parse(userDetails);
        details.lastLogin = new Date();
        await SecureStore.setItemAsync('user', JSON.stringify(details));
        setUser(details);
      }
    } catch (error) {}
  };

  return {
    user,
    storeUserDetails: storeUser,
    getUserDetails: getUser,
    clearUserDetails: clearUser,
    updateLoginTime: updateUserLoginDate,
  };
};

export default useUser;
