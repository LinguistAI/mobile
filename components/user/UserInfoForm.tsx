import { FormProvider, set, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../common/form/Button';
import { IUserDetailedInfo } from './types';
import PrimaryTextInput from '../common/form/PrimaryTextInput';
import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import Colors from '../../theme/colors';
import EmailTextInput from '../common/form/EmailTextInput';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { ENGLISH_LEVELS, HOBBIES_LIST } from './constants';
import PrimaryAutocomplete from '../common/form/PrimaryAutocomplete';
import Selections from '../common/Selections';
import PrimaryDatePicker from '../common/form/PrimaryDatePicker';
import ActionButton from '../common/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { useSetUserDetailsMutation } from './api';
import useNotifications from '../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../utils/httpUtils';
import { dateObjToISODate } from './utils';

interface UserInfoFormProps {
  userDetails: IUserDetailedInfo;
}

const UserInfoForm = ({ userDetails }: UserInfoFormProps) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isDateSelectionVisible, setIsDateSelectionVisible] = useState(false);
  const { user } = useUser();
  const { add } = useNotifications();
  const defaultValues = {
    name: userDetails.name ?? '',
    birthDate: new Date(userDetails.birthDate) ?? new Date(),
    englishLevel: null,
    hobbies: userDetails.hobbies ?? [],
  };
  const methods = useForm({
    defaultValues,
  });

  console.log(userDetails);

  const [mutate, { isError, error, isLoading }] = useSetUserDetailsMutation();

  useEffect(() => {
    const subscription = methods.watch(() => {
      setUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  const onSubmit = async (data: any) => {
    const birthDate = dateObjToISODate(new Date(data.birthDate));
    const newProfile = {
      name: data.name,
      englishLevel: data.englishLevel,
      hobbies: data.hobbies,
      birthDate,
    };
    await mutate(newProfile);

    if (isError) {
      add({ type: 'error', body: generateErrorResponseMessage(error) });
      return;
    }

    add({ type: 'success', body: 'Profile updated successfully.' });
    setUnsavedChanges(false);
  };

  const resetForm = () => {
    methods.reset(defaultValues);
    setUnsavedChanges(false);
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.form}>
        <FormProvider {...methods}>
          <PrimaryTextInput
            placeholder="Username"
            rules={{}}
            defaultValue={user.username}
            name="_username"
            label="Username"
            disabled
            subtitle="Your username is unique and cannot be changed."
          />
          <EmailTextInput
            placeholder="Email"
            rules={{}}
            defaultValue={user.email}
            name="_email"
            label="Email"
            disabled
            subtitle="Your email is unique and cannot be changed."
          />
          <PrimaryTextInput placeholder="Name" rules={{}} defaultValue={userDetails.name} name="name" label="Name" />
          <PrimaryAutocomplete
            name="englishLevel"
            label="English Level"
            dataSet={ENGLISH_LEVELS.map((level) => ({ id: level.value, title: level.label }))}
            initialValue={userDetails.englishLevel ?? null}
          />
          <ActionButton
            title={
              methods.getValues('birthDate')
                ? `Your birth date: ${new Date(methods.getValues('birthDate')).toLocaleDateString()}`
                : 'Pick your birthdate'
            }
            icon={<Ionicons name="calendar" size={20} color={Colors.primary[500]} />}
            onPress={() => setIsDateSelectionVisible(true)}
          />
          {isDateSelectionVisible ? (
            <PrimaryDatePicker
              name="birthDate"
              label="Birth Date"
              rules={{}}
              close={() => setIsDateSelectionVisible(false)}
              defaultValue={userDetails.birthDate ?? new Date()}
            />
          ) : null}
          <View style={styles.btnsContainer}>
            <View style={styles.btn}>
              <Button
                textColor={Colors.gray[700]}
                borderColor={Colors.gray[800]}
                bgColor={Colors.gray[0]}
                onPress={resetForm}
                disabled={!unsavedChanges}
                type="outlined"
              >
                CANCEL
              </Button>
            </View>
            <View style={styles.btn}>
              <Button
                loading={isLoading}
                onPress={methods.handleSubmit(onSubmit)}
                disabled={!unsavedChanges}
                type="primary"
              >
                SAVE
              </Button>
            </View>
          </View>
        </FormProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  form: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
  },
  btnsContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  btn: {
    alignSelf: 'center',
    minWidth: 100,
  },
});

export default UserInfoForm;
