import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { ErrorMessage } from '@hookform/error-message';
import { useController, useFormContext } from 'react-hook-form';
import Colors from '../../../theme/colors';

export interface PrimaryTextInputProps extends TextInputProps {
  name: string;
  label: string;
  rules: Object;
  defaultValue: string;
  disabled?: boolean;
  subtitle?: string;
  rightIcon?: React.ReactNode;
}

const PrimaryTextInput = (props: PrimaryTextInputProps) => {
  const { name } = props;
  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext ? 'TextInput must be wrapped by the FormProvider' : 'Name must be defined';
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

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View style={styles.inputRoot}>
        <View style={[styles.inputContainer]}>
          <TextInput
            editable={!props.disabled}
            style={[styles.textInput]}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            {...props}
          />
          <View style={styles.rightIcon}>{props.rightIcon}</View>
        </View>
      </View>
      {props?.subtitle && <Text style={styles.subtitle}>{props?.subtitle}</Text>}
      <ErrorMessage name={props.name} render={({ message }) => <Text style={styles.errorMessage}>{message}</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: Colors.gray[900],
    fontWeight: 'bold',
  },
  textInput: {
    flexBasis: '100%',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
  },
  inputRoot: {
    height: 50,
    borderWidth: 3,
    paddingHorizontal: 8,
    borderBottomColor: Colors.primary[300],
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    color: Colors.gray[600],
  },
  errorMessage: {
    color: Colors.red[500],
    marginLeft: 12,
    fontSize: 12,
    marginTop: 5,
  },
  rightIcon: {
    right: 20,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5,
    color: Colors.gray[600],
  },
});

export default PrimaryTextInput;
