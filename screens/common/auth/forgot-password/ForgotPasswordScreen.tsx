import { useMutation } from "@tanstack/react-query";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../../../../components/common/form/Button";
import EmailTextInput from "../../../../components/common/form/EmailTextInput";
import PasswordTextInput from "../../../../components/common/form/PasswordTextInput";
import PasswordInputWithRequirements from "../../../../components/common/form/password/PasswordInputWithRequirements";
import { Requirement } from "../../../../components/common/form/password/Requirement";
import useNotifications from "../../../../hooks/useNotifications";
import {
  changePassword,
  register,
  requestPasswordReset,
} from "../../../../services/auth/Auth.service";
import Colors from "../../../../theme/colors";
import { generateErrorResponseMessage } from "../../../../utils/httpUtils";

type ForgotPasswordFormValues = {
  email: string;
};

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen = (props: ForgotPasswordScreenProps) => {
  const { add } = useNotifications();
  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });
  const { mutate: forgotPasswordMutate, isPending } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: (resetPasswordDto: RequestPasswordResetDto) =>
      requestPasswordReset({
        email: resetPasswordDto.email,
      }),
    onSuccess: (data, requestPasswordResetDto) => {
      add({
        body: "We have sent an email to reset your password!",
        title: "Please check your email!",
        type: "success",
        time: 5000,
      });

      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: "Forgot Password Code",
            params: { email: requestPasswordResetDto.email },
          },
        ],
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

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const values = methods.getValues();
    const requestPasswordReset: RequestPasswordResetDto = {
      email: values.email,
    };
    forgotPasswordMutate(requestPasswordReset);
  };

  const onError = (errors: any, e: any) => {
    if (methods.formState.isValid) {
      console.log("No errors. This should not be called.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FormProvider {...methods}>
        <View style={styles.mainSection}>
          <EmailTextInput />
          <Button
            type="primary"
            loading={isPending}
            onPress={methods.handleSubmit(onSubmit, onError)}
          >
            REQUEST PASSWORD
          </Button>
        </View>
      </FormProvider>
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

export default ForgotPasswordScreen;
