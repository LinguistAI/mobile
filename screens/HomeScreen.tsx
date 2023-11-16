import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import ChatStreakContainer from "../containers/ChatStreakContainer";
import Colors from "../theme/colors";

const HomeScreen = () => {
  const [streakModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={streakModalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
      style={{ alignSelf: "center" }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color={Colors.gray["700"]} />
          </TouchableOpacity>
          <ChatStreakContainer />
        </View>
      </View>
    </Modal>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Adjust the background color
    maxHeight: 350,
    marginVertical: 50,
    margin: 10,
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,

    padding: 20,
    paddingVertical: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
