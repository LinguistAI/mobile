import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { ErrorMessage } from "@hookform/error-message";
import { useController, useFormContext } from "react-hook-form";
import Colors from "../../../theme/colors";

export interface PrimaryTextInputProps extends TextInputProps {
  name: string;
  label: string;
  rules: Object;
  defaultValue: string;
  rightIcon?: React.ReactNode;
}

const PrimaryTextInput = (props: PrimaryTextInputProps) => {
  const { name } = props;
  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined";
    console.error(msg);
    return null;
  }

  return <ControlledInput {...props} />;
};

const ControlledInput = (props: PrimaryTextInputProps) => {
  const { field, formState } = useController({
    name: props.name,
    rules: props.rules,
    defaultValue: props.defaultValue,
  });

  // const getErrorBorder = () => {
  //   const errorKeyNames = Object.keys(formState.errors);
  //   if (formState.isSubmitted && !formState.isDirty && !formState.isValid) {
  //     return styles.errorBorder;
  //   }
  // };

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View style={styles.inputRoot}>
        <View style={[styles.inputContainer]}>
          <TextInput
            style={[styles.textInput]}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            {...props}
          />
          {props.rightIcon}
        </View>
      </View>
      <ErrorMessage
        name={props.name}
        render={({ message }) => (
          <Text style={styles.errorMessage}>{message}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: Colors.gray[900],
    fontWeight: "bold",
    marginBottom: 6,
  },
  textInput: {
    flexBasis: "90%",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
  },
  inputRoot: {
    height: 50,
    borderWidth: 2,
    borderBottomColor: Colors.primary[300],
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    color: Colors.gray[600],
  },
  errorMessage: {
    color: "red",
    marginLeft: 10,
    marginTop: 5,
  },
  errorBorder: {
    borderColor: Colors.red[500],
  },
});

export default PrimaryTextInput;
