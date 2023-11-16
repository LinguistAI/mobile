import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ChatStreakContainer from "../containers/ChatStreakContainer";

const HomeScreen = () => {
  const [streakModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  return (
    <View>
      <ChatStreakContainer visible={streakModalVisible} />
    </View>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({});
