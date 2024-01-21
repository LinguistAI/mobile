import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../theme/colors";

interface ActionButtonProps {
  icon: React.ReactElement;
  onPress: () => void;
  title: string;
  subText?: string;
}

const ActionButton = ({ icon, onPress, title, subText }: ActionButtonProps) => {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => {
          return [styles.container, pressed && styles.pressed];
        }}
      >
        <View style={styles.innerContainer}>
          {icon}
          <Text style={styles.title}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: 140,
    borderWidth: 1, // Add border
    borderColor: Colors.primary["600"], // Set border color
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.primary["500"],
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ActionButton;
