import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../theme/colors";
import React from "react";

interface FloatingButtonProps {
  handlePress: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const FloatingButton = ({
  handlePress,
  children,
  icon,
}: FloatingButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.floatingAddListButton}
    >
      {icon ?? <Ionicons name="add" size={30} color="#fff" />}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingAddListButton: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primary["600"],
    borderRadius: 30,
    elevation: 8,
  },
});

export default FloatingButton;
