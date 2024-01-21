import * as SecureStore from "expo-secure-store";
import { atom, useAtom } from "jotai";
import { StoredUserInfoWithTokens } from "../../types/auth";

const emptyUserAtom = {
  username: "",
  email: "",
  accessToken: "",
  refreshToken: "",
  lastLogin: new Date("1970-01-01T00:00:00.000Z"),
};

const userAtom = atom<StoredUserInfoWithTokens>(emptyUserAtom);

const useUser = () => {
  const [user, setUser] = useAtom(userAtom);

  const storeUserDetails = async (details: StoredUserInfoWithTokens) => {
    try {
      await SecureStore.setItemAsync("user", JSON.stringify(details));
      setUser(details);
    } catch (error) {
      // TODO: Handle error
      console.error("Error storing user details: ", error);
    }
  };

  const getUserDetails = async () => {
    try {
      const userDetails = await SecureStore.getItemAsync("user");
      if (userDetails !== null) {
        setUser(JSON.parse(userDetails));
      }
    } catch (error) {
      // TODO: Handle error
      console.error("Error retrieving user details: ", error);
    }
  };

  const clearUserDetails = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      setUser(emptyUserAtom);
    } catch (error) {
      // TODO: Handle error
      console.error("Error clearing user details: ", error);
    }
  };

  const updateLoginTime = async () => {
    try {
      const userDetails = await SecureStore.getItemAsync("user");
      if (userDetails !== null) {
        const details = JSON.parse(userDetails);
        details.lastLogin = new Date();
        await SecureStore.setItemAsync("user", JSON.stringify(details));
        setUser(details);
      }
    } catch (error) {}
  };

  return {
    user,
    storeUserDetails,
    getUserDetails,
    clearUserDetails,
    updateLoginTime,
  };
};

export default useUser;
