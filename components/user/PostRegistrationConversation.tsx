import { ChatMessageSender } from "../../screens/chat/types";
import { useRef, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import ChatMessageComponent from "../chat/ChatMessageComponent";
import ChatTextInputContainer from "../chat/ChatTextInputContainer";
import { ExtendedChatMessage } from "./types";
import ActionButton from "../common/ActionButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme/colors";
import PrimaryButton from "../common/form/PrimaryButton";

type ConversationStep = {
  id: number;
  trigger: number;
  skippable: boolean;
  name: string;
  message: string;
  options?: { value: string; label: string }[];
};

const botMessages: ConversationStep[] = [
  {
    id: 0,
    message:
      "Hi, I'm Luna. Your personal language learning assistant. I'm here to help you learn English. What's your name?",
    skippable: true,
    name: "name",
    trigger: 1,
  },
  {
    id: 1,
    message: "Nice to meet you! How old are you?",
    skippable: true,
    name: "age",
    trigger: 2,
  },
  {
    id: 2,
    message: "Cool! What do you like to do in your free time?",
    skippable: true,
    name: "hobbies",
    trigger: 3,
  },
  {
    id: 3,
    message: "What is your current English level?",
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
  const [user, setUser] = useState({});
  console.log(currentStep);
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

  const handleSkip = () => {
    const currentMessage = botMessages.find((step) => step.id === currentStep);
    if (!currentMessage) return;
    const nextStep = currentMessage.trigger;
    setCurrentStep(nextStep);
    setUser({ ...user, [currentMessage.name]: "" });

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
  };

  const handleNext = (userAnswer: string) => {
    messagesListRef.current?.scrollToEnd({ animated: true });
    setIsBotWriting(true);

    const currentMessage = botMessages.find((step) => step.id === currentStep);
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
      setUser({ ...user, [currentMessage.name]: userAnswer });

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.messagesContainer}>
        <FlatList
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
                }}
              />
            ) : (
              <View style={styles.actionButtons}>
                {messages[messages.length - 1]?.skippable ? (
                  <ActionButton
                    title="Skip"
                    subText="Continue with next question."
                    icon={
                      <Ionicons
                        name="arrow-forward"
                        size={24}
                        color={Colors.primary["500"]}
                      />
                    }
                    onPress={handleSkip}
                    maxWidth={200}
                    divider
                  />
                ) : (
                  <></>
                )}
              </View>
            )
          }
        />
      </View>
      <View style={styles.textInputContainer}>
        {currentStep === -1 ? (
          <PrimaryButton
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }}
          >
            Finish
          </PrimaryButton>
        ) : (
          <ChatTextInputContainer
            onSend={handleNext}
            isPending={isBotWriting}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginTop: 40,
  },
  actionButtons: {
    alignSelf: "flex-end",
    marginHorizontal: 16,
    marginVertical: 16,
  },
});

export default PostRegistrationConversation;