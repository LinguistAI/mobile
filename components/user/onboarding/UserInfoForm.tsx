import { FormProvider, set, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../common/form/Button';
import { IUserDetailedInfo, RProfile } from '../types';
import PrimaryTextInput from '../../common/form/PrimaryTextInput';
import { useEffect, useState } from 'react';
import useUser from '../../../hooks/useUser';
import Colors from '../../../theme/colors';
import EmailTextInput from '../../common/form/EmailTextInput';
import { ENGLISH_LEVELS, HOBBIES_LIST } from '../constants';
import PrimaryAutocomplete from '../../common/form/PrimaryAutocomplete';
import PrimaryDatePicker from '../../common/form/PrimaryDatePicker';
import ActionButton from '../../common/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { useSetUserDetailsMutation } from '../userApi';
import useNotifications from '../../../hooks/useNotifications';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import { dateObjToISODate } from '../utils';
import ItemGroup from '../../common/form/ItemGroup';

interface UserInfoFormProps {
  userDetails: IUserDetailedInfo;
  profileDetails: RProfile;
}

const generateItemGroup = (
  label: string,
  name: string,
  items: string[] | undefined,
  onChange: (selected: string[]) => void,
  addable: boolean
): React.ReactNode => {
  if (!items || items.length === 0) {
    return null; // Return null if items are empty
  }

  return (
    <ItemGroup
      label={label}
      name={name}
      items={items.map((item) => ({ value: item, name: item }))}
      onChange={onChange}
      addable={addable}
    />
  );
};

const UserInfoForm = ({ userDetails, profileDetails }: UserInfoFormProps) => {
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
      birthDate: birthDate,
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
            clearOnFocus={true}
            showClear={false}
            showChevron={false}
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
              rules={{}}
              close={() => setIsDateSelectionVisible(false)}
              defaultValue={userDetails.birthDate ?? new Date()}
            />
          ) : null}
          <ItemGroup
            label='Hobbies:'
            name='hobbies'
            items={userDetails.hobbies.map((hobby) => ({
              value: hobby,
              name: hobby,
            }))}
            onChange={(selectedHobbies: string[]) => {
              methods.setValue('hobbies', selectedHobbies);
            }}
            addable={true}
            addItems={HOBBIES_LIST.map((option) => ({
              value: option.value,
              name: option.label,
            }))}
            noItemsText="You can add some hobbies!"
          />
          {generateItemGroup('You like: ', 'likes', profileDetails.likes, (selected) => {}, false)}
          {generateItemGroup('You love: ', 'loves', profileDetails.loves, (selected) => {}, false)}
          {generateItemGroup('You dislike: ', 'dislikes', profileDetails.dislikes, (selected) => {}, false)}
          {generateItemGroup('You hate: ', 'hates', profileDetails.hates, (selected) => {}, false)}
          <View style={styles.btnsContainer}>
            <View style={styles.btn}>
              <Button onPress={resetForm} disabled={!unsavedChanges} type="outlined">
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
