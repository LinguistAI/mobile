import { FormProvider, set, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../common/form/Button';
import { IUserDetailedInfo, QProfile, RProfile } from '../types';
import PrimaryTextInput from '../../common/form/PrimaryTextInput';
import { useState } from 'react';
import useUser from '../../../hooks/useUser';
import Colors from '../../../theme/colors';
import EmailTextInput from '../../common/form/EmailTextInput';
import { ENGLISH_LEVELS, HOBBIES_LIST } from '../constants';
import PrimaryAutocomplete from '../../common/form/PrimaryAutocomplete';
import PrimaryDatePicker from '../../common/form/PrimaryDatePicker';
import ActionButton from '../../common/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { useSetProfileMutation, useSetUserDetailsMutation } from '../userApi';
import useNotifications from '../../../hooks/useNotifications';
import { dateObjToISODate } from '../utils';
import ItemGroup from '../../common/form/ItemGroup';
import useError from '../../../hooks/useError';
import { isDataResponse } from '../../../services';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';

interface UserInfoFormProps {
  userDetails: IUserDetailedInfo;
  profileDetails: RProfile;
}

const UserInfoForm = ({ userDetails, profileDetails }: UserInfoFormProps) => {
  const [isDateSelectionVisible, setIsDateSelectionVisible] = useState(false);
  const { user } = useUser();
  const { add } = useNotifications();
  const defaultValues = {
    name: userDetails.name ?? '',
    birthDate: userDetails.birthDate ? new Date(userDetails.birthDate) : new Date(),
    englishLevel: null,
    hobbies: userDetails.hobbies ?? [],
    likes: profileDetails.likes ?? null,
    loves: profileDetails.loves ?? null,
    dislikes: profileDetails.dislikes ?? null,
    hates: profileDetails.hates ?? null,
  };
  const methods = useForm({
    defaultValues,
  });

  const [
    mutateUserDetails,
    { isError: isUserDetailsError, error: userDetailsError, isLoading: isUserDetailsLoading },
  ] = useSetUserDetailsMutation();
  const [mutateProfile, { isError: isProfileError, error: profileError, isLoading: isProfileLoading }] =
    useSetProfileMutation();
  useError(userDetailsError);
  useError(profileError);

  const onSubmit = async (data: any) => {
    try {
      const birthDate = dateObjToISODate(new Date(data.birthDate));
      const newProfile = {
        name: data.name,
        englishLevel: data.englishLevel,
        hobbies: data.hobbies,
        birthDate: birthDate,
      };
      const newMLProfile: QProfile = {
        profile: {
          likes: data.likes,
          loves: data.loves,
          dislikes: data.dislikes,
          hates: data.hates,
        },
      };

      const userResponse = await mutateUserDetails(newProfile);
      const mlResponse = await mutateProfile(newMLProfile);

      if (!isDataResponse(userResponse) || !isDataResponse(mlResponse)) return;
      add({ type: 'success', body: 'Profile updated successfully.' });
    } catch (error) {
      if (isUserDetailsError) {
        add({ type: 'error', body: generateErrorResponseMessage(userDetailsError) });
      } else if (isProfileError) {
        add({ type: 'error', body: generateErrorResponseMessage(profileError) });
      } else {
        add({ type: 'error', body: 'An unexpected error occurred.' });
      }
    }
  };

  const renderItemGroup = (
    label: string,
    name: string,
    items: string[] | undefined,
    onChange: (selected: string[]) => void,
    addable: boolean
  ) => {
    if (!items || items.length === 0) {
      return null;
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
          <PrimaryTextInput
            placeholder="Name"
            rules={{}}
            defaultValue={userDetails.name}
            name="name"
            label="Name"
          />
          {/* <PrimaryAutocomplete
            name="englishLevel"
            label="English Level"
            dataSet={ENGLISH_LEVELS.map((level) => ({ id: level.value, title: level.label }))}
            initialValue={userDetails.englishLevel ?? null}
            clearOnFocus={true}
            showClear={false}
            showChevron={false}
          /> */}
          <ActionButton
            title={
              userDetails.birthDate 
                ? `Your birth date: ${new Date(userDetails.birthDate).toLocaleDateString()}`
                : 'Pick your birthdate'
            }
            icon={<Ionicons name="calendar" size={20} color={Colors.primary[500]} />}
            onPress={() => setIsDateSelectionVisible(true)}
          />
          {isDateSelectionVisible ? (
            <PrimaryDatePicker
              label=""
              name="birthDate"
              rules={{}}
              close={() => setIsDateSelectionVisible(false)}
              defaultValue={new Date(userDetails.birthDate) ?? new Date()}
            />
          ) : null}
          <ItemGroup
            label="Hobbies"
            name="hobbies"
            items={userDetails.hobbies.map((hobby) => ({
              value: hobby,
              name: hobby,
            }))}
            onChange={(selectedHobbies: string[]) => {
              methods.setValue('hobbies', selectedHobbies);
            }}
            addable={true}
            itemOptions={HOBBIES_LIST.map((option) => ({
              value: option.value,
              name: option.label,
            }))}
            noItemsText="You can add some hobbies!"
          />
          {renderItemGroup(
            'You like: ',
            'likes',
            profileDetails.likes,
            (selected) => {
              methods.setValue('likes', selected);
            },
            false
          )}
          {renderItemGroup(
            'You love: ',
            'loves',
            profileDetails.loves,
            (selected) => {
              methods.setValue('loves', selected);
            },
            false
          )}
          {renderItemGroup(
            'You dislike: ',
            'dislikes',
            profileDetails.dislikes,
            (selected) => {
              methods.setValue('dislikes', selected);
            },
            false
          )}
          {renderItemGroup(
            'You hate: ',
            'hates',
            profileDetails.hates,
            (selected) => {
              methods.setValue('hates', selected);
            },
            false
          )}
          <View style={styles.btnsContainer}>
            <View style={styles.btn}>
              <Button
                rightIcon={<Ionicons name="save-outline" size={24} color={Colors.gray[0]} />}
                loading={isUserDetailsLoading || isProfileLoading}
                onPress={methods.handleSubmit(onSubmit)}
                type="primary"
              >
                SAVE PROFILE
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
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-start',
  },
  btn: {
    alignSelf: 'center',
    minWidth: 100,
  },
});

export default UserInfoForm;
