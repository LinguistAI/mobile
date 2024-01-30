import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../../theme/colors";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  borderColor?: string;
  textColor?: string;
}

const defaultTextColor = Colors.primary[500];
const defaultBorderColor = Colors.primary[500];

const SecondaryButton = (props: SecondaryButtonProps) => {
  const { children, onPress, borderColor, textColor } = props;

  return (
    <View
      style={[
        styles.outerContainer,
        { borderColor: borderColor ?? defaultBorderColor },
      ]}
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: Colors.gray[100] }}
        style={({ pressed }) => {
          if (Platform.OS === "ios") {
            return [styles.innerContainer, pressed && styles.pressed];
          }
          return styles.innerContainer;
        }}
      >
        <Text
          style={[styles.buttonText, { color: textColor ?? defaultTextColor }]}
        >
          {children}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 8,
    borderWidth: 1.5,
    marginVertical: 8,
    overflow: "hidden",
    borderColor: defaultBorderColor,
    shadowColor: Colors.gray[900],
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 12,
  },
  innerContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: defaultTextColor,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default SecondaryButton;
