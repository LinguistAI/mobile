import { useMutation } from "@tanstack/react-query";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../../../components/common/PrimaryButton";
import PasswordTextInput from "../../../../components/common/input/PasswordTextInput";
import PasswordInputWithRequirements from "../../../../components/common/password/PasswordInputWithRequirements";
import { Requirement } from "../../../../components/common/password/Requirement";
import useNotifications from "../../../../hooks/useNotifications";
import {
  changePassword,
  register,
  saveResetPassword,
} from "../../../../services/auth/Auth.service";
import { generateErrorResponseMessage } from "../../../../utils/httpUtils";

type ForgotPasswordNewPasswordFormValues = {
  password: string;
  repeatPassword: string;
};

interface ForgotPasswordNewPasswordScreenProps {
  navigation: any;
  route: any;
}

const ForgotPasswordNewPasswordScreen = (
  props: ForgotPasswordNewPasswordScreenProps
) => {
  const { add } = useNotifications();
  const methods = useForm<ForgotPasswordNewPasswordFormValues>({
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
    mode: "onSubmit",
  });
  const { mutate: savePasswordMutate, isPending } = useMutation({
    mutationKey: ["saveResetPassword"],
    mutationFn: (passwordResetSaveDto: PasswordResetSaveDto) =>
      saveResetPassword({
        email: passwordResetSaveDto.email,
        resetCode: passwordResetSaveDto.resetCode,
        newPassword: passwordResetSaveDto.newPassword,
      }),
    onSuccess: (data) => {
      add({
        body: "You have successfully changed your password!",
        title: "Success!",
        type: "success",
        time: 5000,
      });

      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    },
    onError: (error: any) => {
      add({
        body: generateErrorResponseMessage(error),
        title: "Error!",
        type: "error",
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
      console.log("No errors. This should not be called.");
    }
  };

  const passwordRequirements: Requirement[] = [
    {
      re: /^.{8,}$/,
      label: "Must be at least 8 characters long.",
    },
    {
      re: /[A-Z]/,
      label: "Must contain at least 1 uppercase letter.",
    },
    {
      re: /[0-9]/,
      label: "Must contain at least 1 number.",
    },
    {
      re: /[^A-Za-z0-9]/,
      label: "Must contain at least 1 special character.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <FormProvider {...methods}>
        <View style={styles.mainSection}>
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
              required: "Repeating password is required!",
              validate: (value: string) =>
                value === methods.getValues("password") ||
                "Passwords must match!",
            }}
          />
          <PrimaryButton
            loading={isPending}
            onPress={methods.handleSubmit(onSubmit, onError)}
          >
            CHANGE PASSWORD
          </PrimaryButton>
        </View>
      </FormProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 32,
    padding: 20,
  },
  mainSection: {
    flex: 1,
    marginVertical: 12,
    padding: 20,
    gap: 15,
  },
});

export default ForgotPasswordNewPasswordScreen;
