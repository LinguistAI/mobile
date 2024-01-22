import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../../../theme/colors";

interface ModalControlButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
}

const ModalControlButtons = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
}: ModalControlButtonsProps) => {
  return (
    <>
      <TouchableOpacity onPress={onCancel}>
        <Text style={[styles.formCancel, styles.formControlText]}>
          {cancelText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSubmit}>
        <Text style={[styles.formControlText, styles.formOk]}>
          {submitText}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  formControlText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  formOk: {
    color: Colors.primary["500"],
  },
  formCancel: {
    color: Colors.red["500"],
  },
});
export default ModalControlButtons;
