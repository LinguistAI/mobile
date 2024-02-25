import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../theme/colors";

interface CloseIconProps {
  onPress: () => void;
}

const CloseIcon = ({ onPress }: CloseIconProps) => {
  return (
    <TouchableOpacity style={styles.closeIcon} onPress={onPress}>
      <Ionicons name="close" size={30} color={Colors.primary["600"]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

export default CloseIcon;
