import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../../../components/common/form/Button';
import PasswordTextInput from '../../../../components/common/form/PasswordTextInput';
import PasswordInputWithRequirements from '../../../../components/common/form/password/PasswordInputWithRequirements';
import { Requirement } from '../../../../components/common/form/password/Requirement';
import useNotifications from '../../../../hooks/useNotifications';
import { saveResetPassword } from '../../../../services/auth/Auth.service';
import { PasswordResetSaveDto } from '../../../../services/auth/Auth.types';
import { generateErrorResponseMessage } from '../../../../utils/httpUtils';

type ForgotPasswordNewPasswordFormValues = {
  password: string;
  repeatPassword: string;
};

interface ForgotPasswordNewPasswordScreenProps {
  navigation: any;
  route: any;
}

const ForgotPasswordNewPasswordScreen = (props: ForgotPasswordNewPasswordScreenProps) => {
  const { add } = useNotifications();
  const methods = useForm<ForgotPasswordNewPasswordFormValues>({
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
    mode: 'onSubmit',
  });
  const { mutate: savePasswordMutate, isPending } = useMutation({
    mutationKey: ['saveResetPassword'],
    mutationFn: (passwordResetSaveDto: PasswordResetSaveDto) =>
      saveResetPassword({
        email: passwordResetSaveDto.email,
        resetCode: passwordResetSaveDto.resetCode,
        newPassword: passwordResetSaveDto.newPassword,
      }),
    onSuccess: (data) => {
      add({
        body: 'You have successfully changed your password!',
        type: 'success',
        time: 5000,
      });

      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
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

  const onSubmit = async (data: ForgotPasswordNewPasswordFormValues) => {
    const values = methods.getValues();
    const passwordResetSaveDTO: PasswordResetSaveDto = {
      email: props.route.params.email,
      resetCode: props.route.params.resetCode,
      newPassword: values.password,
    };

    savePasswordMutate(passwordResetSaveDTO);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <FormProvider {...methods}>
          <View style={styles.mainSection}>
            <PasswordInputWithRequirements
              requirements={passwordRequirements}
              name="password"
              label="New password"
              placeholder="New password"
            />
            <PasswordTextInput
              placeholder="Repeat password"
              label="Repeat new password"
              name="repeatPassword"
              rules={{
                required: 'Repeating password is required!',
                validate: (value: string) =>
                  value === methods.getValues('password') || 'Passwords must match!',
              }}
            />
            <Button type="primary" loading={isPending} onPress={methods.handleSubmit(onSubmit, onError)}>
              CHANGE PASSWORD
            </Button>
          </View>
        </FormProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 12,
    padding: 20,
  },
  mainSection: {
    flex: 1,
    gap: 15,
  },
});

export default ForgotPasswordNewPasswordScreen;
