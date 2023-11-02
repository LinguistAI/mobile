/*

Concept: https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments

*/
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import useNotifications from "../../hooks/useNotifications";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { generateErrorResponseMessage } from "../../utils/httpUtils";
import {
  requestPasswordCode as resetPasswordCode,
  requestPasswordReset,
} from "../../services/auth";
import PrimaryButton from "../../components/PrimaryButton";

const CELL_SIZE = 45;
const CELL_BORDER_RADIUS = 8;
const DEFAULT_CELL_BG_COLOR = "#fff";
const NOT_EMPTY_CELL_BG_COLOR = "#3557b7";
const ACTIVE_CELL_BG_COLOR = "#f7fafe";

const { Value, Text: AnimatedText } = Animated;

const CELL_COUNT = 6;

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = (options: RenderCellOptions) => {
  const hasValue = Boolean(options.symbol);

  Animated.parallel([
    Animated.timing(animationsColor[options.index], {
      useNativeDriver: false,
      toValue: options.isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[options.index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      delay: 100,

      //   duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

type ForgotPasswordCodeFormValues = {
  email: string;
  resetCode: string;
};

interface ForgotPasswordCodeScreenProps {
  navigation: any;
  route: any;
}

const ForgotPasswordCodeScreen = ({
  navigation,
  route,
}: ForgotPasswordCodeScreenProps) => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = (options: RenderCellOptions) => {
    const hasValue = Boolean(options.symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[options.index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[options.index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[options.index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[options.index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell(options);
    }, 0);

    return (
      <AnimatedText
        key={options.index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(options.index)}
      >
        {options.symbol || (options.isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  const { add } = useNotifications();
  const methods = useForm<ForgotPasswordCodeFormValues>({
    defaultValues: {
      resetCode: "",
      email: route.params.email,
    },
    mode: "onSubmit",
  });

  const { mutate: resetPasswordMutate, isPending } = useMutation({
    mutationKey: ["requestPasswordCode"],
    mutationFn: (passwordResetCodeDto: PasswordResetCodeDto) =>
      resetPasswordCode({
        email: passwordResetCodeDto.email,
        resetCode: passwordResetCodeDto.resetCode,
      }),
    onSuccess: (data, passwordResetCodeDto) => {
      add({
        body: "Code is correct!",
        title: "Success!",
        type: "success",
        time: 5000,
      });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Forgot Password New Password",
            params: {
              email: passwordResetCodeDto.email,
              resetCode: passwordResetCodeDto.resetCode,
            },
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

  const onSubmit = async (data: ForgotPasswordCodeFormValues) => {
    const values = methods.getValues();
    const passwordResetCodeDto: PasswordResetCodeDto = {
      email: route.params.email,
      resetCode: value,
    };
    resetPasswordMutate(passwordResetCodeDto);
  };

  const onError = (errors: any, e: any) => {
    if (methods.formState.isValid) {
      console.log("No errors. This should not be called.");
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <FormProvider {...methods}>
        <Text style={styles.subTitle}>
          Please enter the verification code{"\n"}
          we have sent to your email address
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          keyboardType="default"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
        <PrimaryButton
          loading={isPending}
          onPress={methods.handleSubmit(onSubmit, onError)}
        >
          VERIFY
        </PrimaryButton>
      </FormProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  codeFiledRoot: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    fontSize: 30,
    textAlign: "center",
    borderRadius: CELL_BORDER_RADIUS,
    color: "#3759b8",
    backgroundColor: "#fff",

    // IOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },

  // =======================

  root: {
    minHeight: 800,
    padding: 20,
    flex: 1,
    marginVertical: 12,
    gap: 15,
  },
  title: {
    paddingTop: 50,
    color: "#000",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 40,
  },
  subTitle: {
    paddingTop: 30,
    color: "#000",
    textAlign: "center",
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: "#3557b7",
    justifyContent: "center",
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
});

export default ForgotPasswordCodeScreen;
