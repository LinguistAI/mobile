import { ChatMessageSender } from "../../screens/chat/types";
import { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';
import ChatMessageComponent from "../chat/ChatMessageComponent";
import ChatTextInputContainer from "../chat/ChatTextInputContainer";
import { ExtendedChatMessage } from "./types";
import ActionButton from "../common/ActionButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme/colors";
import Button from "../common/form/Button";
import OptionGroup from "../common/form/OptionGroup";
import { formatAsStr } from "../../utils";
import CloseIcon from "../common/CloseIcon";
import Divider from "../common/Divider";
import DateTimePicker from '@react-native-community/datetimepicker';
import { BOT_MESSAGES } from "./constants";

interface PostRegistrationConversationProps {
  navigation: any;
}

const PostRegistrationConversation = ({
  navigation,
}: PostRegistrationConversationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      sender: ChatMessageSender.assistant,
      content: BOT_MESSAGES[0].message,
      timestamp: new Date(),
      id: uuidv4(),
      skippable: BOT_MESSAGES[0].skippable,
    },
  ]);
  const [isBotWriting, setIsBotWriting] = useState(false);
  const [isSkipButtonVisible, setIsSkipButtonVisible] = useState(true)
  const [isDateSelectionVisible, setIsDateSelectionVisible] = useState(false)
  const [birthdate, setBirthDate] = useState(new Date())
  const messagesListRef = useRef<FlatList>(null);

  const currentMessage = BOT_MESSAGES.find((step) => step.id === currentStep);

  useEffect(() => {
    messagesListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSkip = () => {
    if (!currentMessage) return;
    const nextStep = currentMessage.trigger;
    setCurrentStep(nextStep);
    setUserAnswers({ ...userAnswers, [currentMessage.name]: "" });

    const botResponse = BOT_MESSAGES.find((step) => step.id === nextStep);
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

  const handleNext = (userAnswer: string | string[]) => {
    setIsBotWriting(true);

    if (!currentMessage) return;
    if (!userAnswer && currentMessage.skippable) {
      handleSkip();
      return;
    }

    const nextStep = currentMessage.trigger;
    const userResponse: ExtendedChatMessage = {
      content: formatAsStr(userAnswer),
      sender: ChatMessageSender.user,
      timestamp: new Date(),
      id: uuidv4(),
    };

    setMessages((messages) => [...messages, userResponse]);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setUserAnswers({ ...userAnswers, [currentMessage.name]: userAnswer });

      const botResponse = BOT_MESSAGES.find((step) => step.id === nextStep);
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

    if (currentMessage?.type === "date") {
      return (
        <View style={styles.answerBox}>
          <ActionButton
            title={birthdate ? `Selected date: ${birthdate?.toLocaleDateString()}` : "Pick your birthdate"}
            icon={<Ionicons name="calendar" size={20} color={Colors.primary[500]}/>}
            onPress={() => setIsDateSelectionVisible(true)}
          />
          {isDateSelectionVisible ? (
            <DateTimePicker
              value={birthdate}
              mode="date"
              onChange={(event, selectedDate) => {
                setBirthDate(selectedDate || new Date())
                setIsDateSelectionVisible(false)
              }}
            >
            </DateTimePicker>
          ) : null}
          <Button
            type="primary"
            onPress={() => handleNext(birthdate.toISOString())}
          >
            CONFIRM
          </Button>
        </View>
      )
    }

    // Answer by options
    if (currentMessage?.type === "multiple-choice" && currentMessage?.options) {
      return (
          <OptionGroup
            items={currentMessage?.options.map((option) => ({
              value: option.value,
              name: option.label,
            }))}
            onSelectionDone={(value) => handleNext(value)}
            multiple={currentMessage?.multiple ?? false}
          />
      );
    }

    const isLastStep = currentStep === -1;
    if (isLastStep) {
      return (
        <View>
          <Button
           type="primary"
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
                color={"white"}
              />
            }
          >
            CONTINUE
          </Button>
        </View>
      );
    }

    // Answer by text
    return (
      <View style={styles.textInputContainer}>
        <ChatTextInputContainer onSend={handleNext} isPending={isBotWriting} />
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      isSkipButtonVisible ? (
        <View>
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
          <CloseIcon onPress={() => {setIsSkipButtonVisible(false)}}/>
          </View>
          <Divider />
          </View>
      ) : null
    )
  }

  const renderMessages = () => {
    const getFooter = () => {
      if (isBotWriting) {
        return (
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
        )
      }

      return (
        <View style={styles.actionButtons}>
          {messages[messages.length - 1]?.skippable ? (
            <ActionButton
              title="Skip this question"
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

    return (
      <FlatList
        ref={messagesListRef}
        data={messages}
        renderItem={({ item }) => (
          <ChatMessageComponent onWordPress={() => {}} chatMessage={item} />
        )}
        keyExtractor={(item) => item.id || item.timestamp.toString()}
        ListFooterComponent={getFooter()}
      />
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.messagesContainer}>
        <View>
          {renderSkipButton()}
        </View>
        {renderMessages()}
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
  optionsGroupContainer: {
    flex: 3,
    maxHeight: 400
  },
  answerBox: {
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 10
  }
});

export default PostRegistrationConversation;
