import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../../theme/colors";

export type Requirement = {
  re: RegExp;
  label: string;
};

interface RequirementProps {
  meets: boolean;
  text: string;
}
const PasswordRequirement = (props: RequirementProps) => {
  const { meets, text } = props;

  return (
    <View>
      <Text
        style={[styles.requirementText, meets ? styles.meets : styles.fails]}
      >
        {meets ? (
          <Ionicons name="checkmark-circle" size={14} color={Colors.green[600]} />
        ) : (
          <Ionicons name="close-circle" size={14} color={Colors.red[600]} />
        )}
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  meets: {
    color: Colors.green[600],
  },
  fails: {
    color: Colors.red[600],
  },
  requirementText: {
    fontSize: 14,
  },
});

export default PasswordRequirement;
