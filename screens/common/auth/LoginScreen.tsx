import { useMutation } from '@tanstack/react-query';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../../components/common/form/Button';
import EmailTextInput from '../../../components/common/form/EmailTextInput';
import PasswordTextInput from '../../../components/common/form/PasswordTextInput';
import useNotifications from '../../../hooks/useNotifications';
import useUser from '../../../hooks/useUser';
import { login } from '../../../services/auth';
import { LoginDto } from '../../../services/auth/Auth.types';
import Colors from '../../../theme/colors';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';

type FormValues = {
  email: string;
  password: string;
};

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen = (props: LoginScreenProps) => {
  const { add } = useNotifications();
  const { storeUserDetails } = useUser();
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: (loginDto: LoginDto) => login({ email: loginDto.email, password: loginDto.password }),
    onSuccess: (res) => {
      if (!res.data.data) {
        add({
          body: 'Something went wrong!',
          title:
            'We are unable to log you in at the moment because we are unable to retrieve your user details. Please try again later',
          type: 'error',
          time: 10000,
        });
        return;
      }

      storeUserDetails({
        ...res.data.data,
        lastLogin: new Date(),
      });
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    },
    onError: (error: any) => {
      console.log(error);
      add({
        body: generateErrorResponseMessage(error),
        type: 'error',
        time: 5000,
      });
    },
  });

  const onForgotPassword = () => {
    props.navigation.navigate('Forgot Password');
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    loginMutate(data);
  };

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {};

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <FormProvider {...methods}>
            <EmailTextInput />
            <PasswordTextInput />
            <Text style={styles.forgotPassword} onPress={onForgotPassword}>
              Forgot password?
            </Text>
            <Button type="primary" loading={isPending} onPress={methods.handleSubmit(onSubmit, onError)}>
              LOG IN
            </Button>
          </FormProvider>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 12,
    padding: 20,
    gap: 25,
  },
  forgotPassword: {
    color: Colors.primary[300],
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
