import { Modal, StyleSheet, Text, View } from "react-native";

interface ModalWrapperProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactElement;
  title?: string;
  width?: number;
}

const ModalWrapper = ({
  visible,
  onRequestClose,
  title,
  children,
  width,
}: ModalWrapperProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
      style={{ alignSelf: "center" }}
    >
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {
              width: width ? width : "90%",
            },
          ]}
        >
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    alignItems: "center",
    borderRadius: 20,
    width: "90%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    gap: 20,
  },
});

export default ModalWrapper;
