import { ErrorMessage } from '@hookform/error-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useController, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';

interface DatePickerProps {
  name: string;
  label: string;
  rules: Object;
  defaultValue: Date;
  close: () => void;
  subtitle?: string;
  rightIcon?: React.ReactNode;
}

const PrimaryDatePicker = (props: DatePickerProps) => {
  const { name } = props;
  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext ? 'TextInput must be wrapped by the FormProvider' : 'Name must be defined';
    console.error(msg);
    return null;
  }

  return <ControlledDatePicker {...props} />;
};

const ControlledDatePicker = (props: DatePickerProps) => {
  const { field, formState } = useController({
    name: props.name,
    rules: props.rules,
    defaultValue: props.defaultValue,
  });

  return (
    <View>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <DateTimePicker
        onChange={(event, selectedDate) => {
          field.onChange(selectedDate);
          props.close();
        }}
        value={field.value}
        mode="date"
        {...props}
      />
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
  errorMessage: {
    color: Colors.red[500],
    marginLeft: 12,
    fontSize: 12,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.gray[600],
  },
});

export default PrimaryDatePicker;
