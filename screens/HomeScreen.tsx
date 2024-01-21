import { useEffect, useState } from "react";
import { Modal, SafeAreaView, StyleSheet, View } from "react-native";
import CloseIcon from "../components/common/CloseIcon";
import ChatStreakContainer from "../components/gamification/ChatStreakContainer";
import useUser from "../hooks/auth/useUser";
import { isDateToday } from "../utils/date.utils";
import ActionButton from "../components/common/ActionButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../theme/colors";

const HomeScreen = () => {
  const [streakModalVisible, setModalVisible] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user && isDateToday(user.lastLogin)) {
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  }, [user]);

  return (
    <SafeAreaView>
      <View style={styles.root}>
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
              <CloseIcon
                onPress={() => {
                  setModalVisible(false);
                }}
              />
              <ChatStreakContainer />
            </View>
          </View>
        </Modal>
        <View style={styles.chatStreakButtonContainer}>
          <ActionButton
            icon={
              <Ionicons
                name="calendar"
                size={24}
                color={Colors.primary["500"]}
              />
            }
            onPress={() => {
              setModalVisible(true);
            }}
            title="Chat Streak"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    marginTop: 40,
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
  chatStreakButtonContainer: {
    maxWidth: 150,
    marginLeft: 20,
  },
});
