import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../../theme/colors";
import { useRef } from "react";

const OUTLINED_BUTTON_TEXT_COLOR = Colors.primary[500];
const OUTLINED_BUTTON_BORDER_COLOR = Colors.primary[500];

interface PrimaryButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  onPress?: () => void;
  rightIcon?: React.ReactNode;
  type: "primary" | "outlined"
}

const Button = (props: PrimaryButtonProps) => {
  const { children, onPress, loading, rightIcon, type } = props;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    let baseButtonStyle = []
    if (type === "outlined") {
      baseButtonStyle.push(styles.outlinedButton)
    } else if (type === "primary") {
      baseButtonStyle.push(styles.primaryButton)
    }

    baseButtonStyle = [...baseButtonStyle, {transform: [{scale: scaleAnim}]}]

    return baseButtonStyle
  }

  const getTextStyle = () => {
    if (type === "outlined") {
      return styles.outlinedButtonText
    } else if (type === "primary") {
      return styles.primaryButtonText
    }
  }

  return (
    <Animated.View style={getButtonStyle()}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={styles.btnContent}>
            <Text style={getTextStyle()}>{children}</Text>
            {rightIcon}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.primary[500],
    borderBottomColor: Colors.primary[700],
    borderBottomWidth: 6,
    borderRightColor: Colors.primary[700],
    borderRightWidth: 6,
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 4,
    borderTopRightRadius: 2,
    borderRadius: 4,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  outlinedButton: {
    borderRadius: 4,
    borderWidth: 1.5,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: Colors.gray[900],
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 12,
    borderColor: OUTLINED_BUTTON_BORDER_COLOR,
    borderBottomColor: Colors.primary[700],
    borderBottomWidth: 6,
    borderRightColor: Colors.primary[700],
    borderRightWidth: 6,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  outlinedButtonText: {
    color: OUTLINED_BUTTON_TEXT_COLOR,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default Button;
