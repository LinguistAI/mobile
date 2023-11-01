import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import EmailTextInput from "../components/input/EmailTextInput";
import Colors from "../theme/colors";
import PasswordInputWithRequirements from "../containers/PasswordInputWithRequirements/PasswordInputWithRequirements";
import { Requirement } from "../containers/PasswordInputWithRequirements/Requirement";
import PasswordTextInput from "../components/input/PasswordTextInput";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth/Auth.service";
import { generateErrorResponseMessage } from "../utils/httpUtils";
import useNotifications from "../hooks/useNotifications";

type ForgotPasswordFormValues = {
  password: string;
  repeatPassword: string;
};

interface ChangePasswordScreenProps {
  navigation: any;
}

const ChangePasswordScreen = (props: ChangePasswordScreenProps) => {
  const { add } = useNotifications();
  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
    mode: "onSubmit",
  });
  const { mutate: registerMutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: (registerDto: RegisterDto) =>
      register({
        email: registerDto.email,
        password: registerDto.password,
        username: registerDto.username,
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

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const values = methods.getValues();
    const changePasswordDTO: ChangePasswordDto = {
      password: values.password,
    };
    // TODO: Add change password mutate
    // registerMutate(changePasswordDTO);
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
          <Text style={styles.hintText}>
            You will receive an email to create a new password if your email
            exists in our system.
          </Text>
          <PrimaryButton onPress={methods.handleSubmit(onSubmit, onError)}>
            Change Password
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
    justifyContent: "flex-start",
  },
  hintText: {
    color: Colors.gray[600],
  },
  mainSection: {
    flex: 5,
    gap: 15,
  },
});

export default ChangePasswordScreen;
