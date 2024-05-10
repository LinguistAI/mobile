import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Colors from "../../theme/colors";
import React from "react";

interface FloatingButtonProps {
  handlePress: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  text?: string; 
}

const FloatingButton = ({
  handlePress,
  children,
  icon,
  text, // Destructure the text prop
}: FloatingButtonProps) => {
  const buttonWidth = text ? 130 : 56; // Set button width based on text prop

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.floatingAddListButton, { width: buttonWidth }]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {text && <Text style={styles.buttonText}>{text}</Text>}
        {icon ?? <Ionicons name="add" size={30} color="#fff" />}
      </View>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingAddListButton: {
    position: "absolute",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primary["600"],
    borderRadius: 30,
    elevation: 8,
    flexDirection: "row", 
  },
  buttonText: {
    color: Colors.gray["0"],
    fontSize: 17,
    marginLeft: 5, 
    marginRight: 5,
    fontWeight: 'bold'
  },
});

export default FloatingButton;
