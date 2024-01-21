import { useMutation } from "@tanstack/react-query";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../../components/common/PrimaryButton";
import EmailTextInput from "../../../components/common/input/EmailTextInput";
import PasswordTextInput from "../../../components/common/input/PasswordTextInput";
import useUser from "../../../hooks/auth/useUser";
import useNotifications from "../../../hooks/useNotifications";
import { login } from "../../../services/auth";
import Colors from "../../../theme/colors";
import { generateErrorResponseMessage } from "../../../utils/httpUtils";

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
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (loginDto: LoginDto) =>
      login({ email: loginDto.email, password: loginDto.password }),
    onSuccess: (res) => {
      add({
        body: res.data.msg,
        type: "success",
        time: 5000,
      });

      if (!res.data.data) {
        add({
          body: "Something went wrong!",
          title:
            "We are unable to log you in at the moment because we are unable to retrieve your user details. Please try again later",
          type: "error",
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
        routes: [{ name: "Main" }],
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

  const onForgotPassword = () => {
    props.navigation.navigate("Forgot Password");
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    loginMutate(data);
  };

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {};

  return (
    <ScrollView>
      <View style={styles.container}>
        <FormProvider {...methods}>
          <EmailTextInput />
          <PasswordTextInput />
          <Text style={styles.forgotPassword} onPress={onForgotPassword}>
            Forgot Password?
          </Text>
          <PrimaryButton
            loading={isPending}
            onPress={methods.handleSubmit(onSubmit, onError)}
          >
            LOG IN
          </PrimaryButton>
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
    gap: 15,
  },
  forgotPassword: {
    color: Colors.primary[300],
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

export default LoginScreen;