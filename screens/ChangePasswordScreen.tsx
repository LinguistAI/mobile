import { useMutation } from "@tanstack/react-query";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import EmailTextInput from "../components/input/EmailTextInput";
import PasswordTextInput from "../components/input/PasswordTextInput";
import PasswordInputWithRequirements from "../containers/PasswordInputWithRequirements/PasswordInputWithRequirements";
import { Requirement } from "../containers/PasswordInputWithRequirements/Requirement";
import useNotifications from "../hooks/useNotifications";
import { changePassword, register } from "../services/auth/Auth.service";
import Colors from "../theme/colors";
import { generateErrorResponseMessage } from "../utils/httpUtils";

type ChangePasswordFormValues = {
  oldPassword: string;
  password: string;
  repeatPassword: string;
};

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen = (props: ChangePasswordScreenProps) => {
  const { add } = useNotifications();
  const methods = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      password: "",
      repeatPassword: "",
    },
    mode: "onSubmit",
  });
  const { mutate: changePasswordMutate, isPending } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (changePasswordDto: ChangePasswordDto) =>
      changePassword({
        oldPassword: changePasswordDto.oldPassword,
        newPassword: changePasswordDto.newPassword,
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
        routes: [{ name: "Main", screen: "Profile" }],
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

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const values = methods.getValues();
    const changePasswordDTO: ChangePasswordDto = {
      oldPassword: values.oldPassword,
      newPassword: values.password,
    };
    // TODO: Add change password mutate
    changePasswordMutate(changePasswordDTO);
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
    <View style={styles.container}>
      <FormProvider {...methods}>
        <View style={styles.mainSection}>
          <PasswordTextInput
            placeholder="Old password"
            label="Old password"
            name="oldPassword"
            rules={{
              required: "Old password is required!",
            }}
          />
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
    </View>
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

export default ChangePasswordScreen;
