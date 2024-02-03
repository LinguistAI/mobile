import { ChatMessageSender } from "../../screens/chat/types";
import { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import ChatMessageComponent from "../chat/ChatMessageComponent";
import ChatTextInputContainer from "../chat/ChatTextInputContainer";
import { ConversationStep, ExtendedChatMessage } from "./types";
import ActionButton from "../common/ActionButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme/colors";
import PrimaryButton from "../common/form/PrimaryButton";
import OptionGroup from "../common/form/OptionGroup";

const botMessages: ConversationStep[] = [
  {
    id: 0,
    message:
      "Hi, I'm Luna. Your personal language learning assistant. I'm here to help you learn English. What's your name?",
    skippedMsg: "Okay, let's skip that for now. What's your name?",
    skippable: false,
    name: "name",
    trigger: 1,
  },
  {
    id: 1,
    message: "Nice to meet you! How old are you?",
    skippedMsg: "Okay, let's skip that for now. How old are you?",
    options: [
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55-64", label: "55-64" },
      { value: "65+", label: "65+" },
    ],
    skippable: true,
    name: "age",
    trigger: 2,
  },
  {
    id: 2,
    message: "Cool! What do you like to do in your free time?",
    skippedMsg:
      "Fine, we can skip that. What do you like to do in your free time?",
    skippable: true,
    name: "hobbies",
    trigger: 3,
  },
  {
    id: 3,
    message: "What is your current English level?",
    skippedMsg: "Alright, let's skip that. What is your current English level?",
    options: [
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
      { value: "Native", label: "Native" },
      { value: "I don't know", label: "I don't know" },
    ],
    name: "englishLevel",
    skippable: true,
    trigger: -1,
  },
  {
    id: -1,
    message:
      "Great, Nice to meet you again! I'll be in touch soon to help you learn English!",
    skippedMsg: "It's okay, we can continue later. Nice to meet you!",
    skippable: false,
    name: "end",
    trigger: -1,
  },
];

interface PostRegistrationConversationProps {
  navigation: any;
}

const PostRegistrationConversation = ({
  navigation,
}: PostRegistrationConversationProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      sender: ChatMessageSender.assistant,
      content: botMessages[0].message,
      timestamp: new Date(),
      id: uuidv4(),
      skippable: botMessages[0].skippable,
    },
  ]);
  const [isBotWriting, setIsBotWriting] = useState<boolean>(false);
  const messagesListRef = useRef<FlatList>(null);

  const currentMessage = botMessages.find((step) => step.id === currentStep);

  useEffect(() => {
    messagesListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSkip = () => {
    if (!currentMessage) return;
    const nextStep = currentMessage.trigger;
    setCurrentStep(nextStep);
    setUserAnswers({ ...userAnswers, [currentMessage.name]: "" });

    const botResponse = botMessages.find((step) => step.id === nextStep);
    setMessages((messages) => [
      ...messages,
      {
        sender: ChatMessageSender.assistant,
        content: botResponse?.skippedMsg || "",
        timestamp: new Date(),
        id: uuidv4(),
        skippable: botResponse?.skippable || false,
      },
    ]);
  };

  const handleNext = (userAnswer: string) => {
    setIsBotWriting(true);

    if (!currentMessage) return;
    if (!userAnswer && currentMessage.skippable) {
      handleSkip();
      return;
    }
    const nextStep = currentMessage.trigger;
    const userResponse: ExtendedChatMessage = {
      content: userAnswer,
      sender: ChatMessageSender.user,
      timestamp: new Date(),
      id: uuidv4(),
    };

    setMessages((messages) => [...messages, userResponse]);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setUserAnswers({ ...userAnswers, [currentMessage.name]: userAnswer });

      const botResponse = botMessages.find((step) => step.id === nextStep);
      setMessages((messages) => [
        ...messages,
        {
          sender: ChatMessageSender.assistant,
          content: botResponse?.message || "",
          timestamp: new Date(),
          id: uuidv4(),
          skippable: botResponse?.skippable || false,
        },
      ]);
      setIsBotWriting(false);
    }, 3000);
  };

  const renderAnswerBox = () => {
    if (isBotWriting) {
      return null;
    }

    // Answer by options
    if (currentMessage?.options) {
      return (
        <OptionGroup
          items={currentMessage.options.map((option) => ({
            value: option.value,
            name: option.label,
          }))}
          onSelectionChange={(value) => handleNext(value)}
        />
      );
    }

    const isLastStep = currentStep === -1;
    if (isLastStep) {
      <PrimaryButton
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
        rightIcon={
          <Ionicons
            name="arrow-forward"
            size={24}
            color={Colors.primary["500"]}
          />
        }
      >
        Continue
      </PrimaryButton>;
    }

    // Answer by text
    return (
      <View style={styles.textInputContainer}>
        <ChatTextInputContainer onSend={handleNext} isPending={isBotWriting} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.messagesContainer}>
        <View style={styles.skipButton}>
          <ActionButton
            bgColor={Colors.gray["0"]}
            icon={
              <Ionicons
                name="arrow-forward"
                size={24}
                color={Colors.primary["600"]}
              />
            }
            onPress={() => navigation.navigate("Main")}
            maxWidth={250}
            title={"Skip"}
            divider
            subText="We will ask some questions to personalize your experience. You can skip this step if you want."
          />
        </View>
        <FlatList
          ref={messagesListRef}
          data={messages}
          renderItem={({ item }) => (
            <ChatMessageComponent onWordPress={() => {}} chatMessage={item} />
          )}
          keyExtractor={(item) => item.id || item.timestamp.toString()}
          ListFooterComponent={
            isBotWriting ? (
              <ChatMessageComponent
                onWordPress={() => {}}
                isWriting={true}
                chatMessage={{
                  sender: ChatMessageSender.assistant,
                  content: "",
                  timestamp: new Date(),
                  id: uuidv4(),
                }}
              />
            ) : (
              <View style={styles.actionButtons}>
                {messages[messages.length - 1]?.skippable ? (
                  <ActionButton
                    title="Next question"
                    icon={
                      <Ionicons
                        name="arrow-forward"
                        size={24}
                        color={Colors.primary["500"]}
                      />
                    }
                    onPress={handleSkip}
                    maxWidth={200}
                  />
                ) : (
                  <></>
                )}
              </View>
            )
          }
        />
      </View>
      {renderAnswerBox()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
  },
  textInputContainer: {
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 48,
  },
  messagesContainer: {
    flex: 12,
    marginHorizontal: 16,
    marginTop: 10,
  },
  actionButtons: {
    alignSelf: "flex-end",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  continueButtonChildren: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    alignSelf: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default PostRegistrationConversation;
