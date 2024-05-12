import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Dimensions, Platform, ScrollView, StyleSheet, View, Text } from 'react-native';
import CheckBox from 'expo-checkbox';
import Button from '../../../components/common/form/Button';
import EmailTextInput from '../../../components/common/form/EmailTextInput';
import PasswordTextInput from '../../../components/common/form/PasswordTextInput';
import PrimaryTextInput from '../../../components/common/form/PrimaryTextInput';
import PasswordInputWithRequirements from '../../../components/common/form/password/PasswordInputWithRequirements';
import { Requirement } from '../../../components/common/form/password/Requirement';
import useNotifications from '../../../hooks/useNotifications';
import useUser from '../../../hooks/useUser';
import { register } from '../../../services/auth';
import { RegisterDto } from '../../../services/auth/Auth.types';
import { StoredUserInfoWithTokens } from '../../../types';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import PrivacyPolicyModal from '../../../components/user/PrivacyPolicyModal';
import Colors from '../../../theme/colors';

type RegisterFormValues = {
  userName: string;
  password: string;
  email: string;
  repeatPassword: string;
  privacyPolicyAccepted: boolean; 
};

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen = (props: RegisterScreenProps) => {
  const { add } = useNotifications();
  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      repeatPassword: '',
      privacyPolicyAccepted: false, 
    },
    mode: 'onSubmit',
  });
  const { storeUserDetails } = useUser();
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false); 

  const { mutate: registerMutate, isPending } = useMutation({
    mutationKey: ['register'],
    mutationFn: (registerDto: RegisterDto) =>
      register({
        email: registerDto.email,
        password: registerDto.password,
        username: registerDto.username,
      }),
    onSuccess: (res) => {
      storeUserDetails(res.data.data as StoredUserInfoWithTokens);
      props.navigation.navigate('Welcome Conversation');
    },
    onError: (error: any) => {
      add({
        body: generateErrorResponseMessage(error),
        title: 'Error!',
        type: 'error',
        time: 5000,
      });
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const values = methods.getValues();
    const registerDto: RegisterDto = {
      email: values.email,
      password: values.password,
      username: values.userName,
    };
    registerMutate(registerDto);
  };

  const onError = (errors: any, e: any) => {
    if (methods.formState.isValid) {
      return;
    }
  };

  const passwordRequirements: Requirement[] = [
    {
      re: /^.{8,}$/,
      label: 'Must be at least 8 characters long.',
    },
    {
      re: /[A-Z]/,
      label: 'Must contain at least 1 uppercase letter.',
    },
    {
      re: /[0-9]/,
      label: 'Must contain at least 1 number.',
    },
    {
      re: /[^A-Za-z0-9]/,
      label: 'Must contain at least 1 special character.',
    },
  ];

  const { height } = Dimensions.get('window');
  const keyboardPadding = Platform.OS === 'ios' ? height * 0.1 : 0;
  const togglePrivacyModal = () => {
    setPrivacyModalVisible(!privacyModalVisible);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <FormProvider {...methods}>
          <PrimaryTextInput
            defaultValue=""
            name="userName"
            rules={{
              required: 'Username is required!',
              pattern: {
                value: /^.{3,}$/,
                message: 'Username must be at least 3 characters long!',
              },
            }}
            label="Username"
            placeholder="Username"
          />
            <EmailTextInput name="email" />
            <PasswordInputWithRequirements
              requirements={passwordRequirements}
              name="password"
              label="Password"
              placeholder="Password"
            />
            <PasswordTextInput
              placeholder="Repeat password"
              label="Repeat password"
              name="repeatPassword"
              rules={{
                required: 'Repeating password is required!',
                validate: (value: string) =>
                  value === methods.getValues('password') || 'Passwords must match!',
              }}
            />

            <View style={styles.privacyPolicyContainer}>
              <CheckBox
                color={Colors.primary[500]}
                value={methods.watch('privacyPolicyAccepted')}
                onValueChange={(newValue) => methods.setValue('privacyPolicyAccepted', newValue)}
              />
              <Text style={styles.privacyPolicyText} onPress={togglePrivacyModal}>I have read and agree to Linguist's privacy policy.</Text>
            </View>

            <Button
              type="primary"
              loading={isPending}
              onPress={methods.handleSubmit(onSubmit, onError)}
              disabled={!methods.watch('privacyPolicyAccepted')}
            >
              REGISTER
            </Button>
          </FormProvider>
        </View>
      </KeyboardAvoidingView>

      <PrivacyPolicyModal visible={privacyModalVisible} onClose={togglePrivacyModal} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginVertical: 12,
    padding: 20,
    gap: 15,
  },
  errorMessage: {
    color: 'red',
  },
  privacyPolicyContainer:{
    flexDirection: 'row', 
    alignItems: 'center',
    marginVertical: 5,
  },
  privacyPolicyText: {
    color: Colors.gray[700],
    textDecorationLine: 'underline',
    marginLeft: 5,
  }
});

export default RegisterScreen;
