import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../../theme/colors";

interface PrimaryButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  onPress?: () => void;
}

const PrimaryButton = (props: PrimaryButtonProps) => {
  const { children, onPress, loading } = props;

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={onPress}
        disabled={loading}
        android_ripple={{ color: Colors.primary[600] }}
        style={({ pressed }) => {
          if (Platform.OS === "ios") {
            return [styles.innerContainer, pressed && styles.pressed];
          }
          return styles.innerContainer;
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>{children}</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 4,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: Colors.gray[800],
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 12,
  },
  innerContainer: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  pressed: {
    opacity: 0.75,
  },
});

export default PrimaryButton;