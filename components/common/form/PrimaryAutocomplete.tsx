import { useController, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownProps } from 'react-native-autocomplete-dropdown';
import Colors from '../../../theme/colors';
import { useEffect } from 'react';

interface PrimaryAutocompleteProps extends AutocompleteDropdownProps {
  name: string;
  label: string;
  initialValue: string;
}

const PrimaryAutocomplete = (props: PrimaryAutocompleteProps) => {
  const { name } = props;
  const formContext = useFormContext();
  if (!formContext || !name) {
    const msg = !formContext ? 'Switch must be wrapped by the FormProvider' : 'Name must be defined';
    console.error(msg);
    return null;
  }
  return <ControlledAutocompleteDropdown {...props} />;
};

const ControlledAutocompleteDropdown = (props: PrimaryAutocompleteProps) => {
  const { name, label, initialValue: defaultValue } = props;
  const { field } = useController({
    name,
    defaultValue,
  });

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <AutocompleteDropdown
        onSelectItem={(item) => field.onChange(item?.id || null)}
        onClear={() => field.onChange(null)}
        onBlur={field.onBlur}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: Colors.gray[900],
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default PrimaryAutocomplete;
