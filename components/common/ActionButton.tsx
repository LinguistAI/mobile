import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../theme/colors";

interface ActionButtonProps {
  icon: React.ReactElement;
  onPress: () => void;
  title?: string | React.ReactElement;
  divider?: boolean;
  subText?: string;
}

const ActionButton = ({
  icon,
  onPress,
  title,
  subText,
  divider,
}: ActionButtonProps) => {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => {
          return [styles.container, pressed && styles.pressed];
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.mainContentContainer}>
            {icon}
            <Text style={styles.title}>{title}</Text>
          </View>
          {divider && <View style={styles.divider} />}
          {subText && (
            <View>
              <Text style={styles.subText}>{subText}</Text>
            </View>
          )}
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
    borderWidth: 2, // Add border
    borderColor: Colors.primary["600"], // Set border color
    maxWidth: 250,
  },
  mainContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.gray["600"],
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.primary["500"],
  },
  subText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ActionButton;
