import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import EmailTextInput from "../components/input/EmailTextInput";
import Colors from "../theme/colors";

type ForgotPasswordFormValues = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
    console.log(data);
  };

  const onError: SubmitErrorHandler<ForgotPasswordFormValues> = (
    errors,
    e
  ) => {};

  return (
    <View style={styles.container}>
      <FormProvider {...methods}>
        <View style={styles.mainSection}>
          <EmailTextInput name="email" />
          <Text style={styles.hintText}>
            You will receive an email to create a new password if your email
            exists in our system.
          </Text>
          <PrimaryButton onPress={methods.handleSubmit(onSubmit, onError)}>
            RESET PASSWORD
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

export default ForgotPasswordScreen;
