import { ReactPropTypes } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Colors from "../theme/colors";

interface ActionIconProps {
  icon: React.ReactElement;
  onPress: () => void;
  disabled?: boolean;
}

const ActionIcon = ({ icon, onPress, disabled }: ActionIconProps) => {
  return (
    <View>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => {
          return [styles.innerContainer, pressed && styles.pressed];
        }}
      >
        {icon}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    overflow: "hidden",
  },
  innerContainer: {
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ActionIcon;
