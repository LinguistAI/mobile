import { ChatMessageSender } from '../../../screens/chat/types';
import { useEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import ChatMessageComponent from '../../chat/ChatMessageComponent';
import ChatTextInputContainer from '../../chat/ChatTextInputContainer';
import { ExtendedChatMessage, IUserDetailedInfo } from '../types';
import ActionButton from '../../common/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import Button from '../../common/form/Button';
import OptionGroup from '../../common/form/OptionGroup';
import { formatAsStr } from '../../../utils';
import CloseIcon from '../../common/CloseIcon';
import Divider from '../../common/Divider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ENGLISH_LEVELS, BOT_MESSAGES } from '../constants';
import { useSetUserDetailsMutation } from '../userApi';
import useNotifications from '../../../hooks/useNotifications';
import { objectIsNotEmpty } from '../../utils';
import useUser from '../../../hooks/useUser';
import { dateObjToISODate } from '../utils';

interface PostRegistrationConversationProps {
  navigation: any;
}

const PostRegistrationConversation = ({ navigation }: PostRegistrationConversationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IUserDetailedInfo | {}>({});
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
  const [isSkipButtonVisible, setIsSkipButtonVisible] = useState(true);
  const [isDateSelectionVisible, setIsDateSelectionVisible] = useState(false);
  const [birthdate, setBirthDate] = useState(new Date());
  const messagesListRef = useRef<FlatList>(null);
  const { add: addNotification } = useNotifications();
  const [setUserDetails, { isLoading, isError }] = useSetUserDetailsMutation();

  const currentMessage = BOT_MESSAGES.find((step) => step.id === currentStep);

  const handleSkip = () => {
    if (!currentMessage) return;
    const nextStep = currentMessage.trigger;
    setCurrentStep(nextStep);
    setUserAnswers({ ...userAnswers, [currentMessage.name]: '' });

    const botResponse = BOT_MESSAGES.find((step) => step.id === nextStep);
    setMessages((messages) => [
      ...messages,
      {
        sender: ChatMessageSender.assistant,
        content: botResponse?.skippedMsg || '',
        timestamp: new Date(),
        id: uuidv4(),
        skippable: botResponse?.skippable || false,
      },
    ]);
  };

  const handleFinish = async () => {
    if (objectIsNotEmpty(userAnswers)) {
      await setUserDetails(userAnswers);
      if (isError) {
        addNotification({
          body: 'There was an error saving your details. You can try again later from your profile.',
          type: 'warning',
        });
      }

      addNotification({
        body: 'Your details have been saved successfully.',
        type: 'success',
      });
    }
    navigation.navigate('Main');
  };

  const handleNext = (userAnswer: string | string[]) => {
    setIsBotWriting(true);

    if (!currentMessage) return;
    if (!userAnswer && currentMessage.skippable) {
      handleSkip();
      return;
    }

    const nextStep = currentMessage.trigger;
    let shownAnswer: string;

    switch (currentMessage.name) {
      case 'birthDate':
        const localDateString = new Date(String(userAnswer)).toLocaleDateString();
        shownAnswer = `I was born on ${formatAsStr(localDateString)}.`;
        userAnswer = formatAsStr(userAnswer);
        break;
      case 'hobbies':
        if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
          shownAnswer = 'Nothing much.';
        } else {
          shownAnswer = formatAsStr(userAnswer);
        }
        break;
      case 'englishLevel':
        shownAnswer = formatAsStr(userAnswer);
        const foundLevel = ENGLISH_LEVELS.find((level) => level.label === shownAnswer);
        userAnswer = foundLevel ? foundLevel.value : '';
        break;
      default:
        shownAnswer = formatAsStr(userAnswer);
        userAnswer = formatAsStr(userAnswer);
    }

    const userResponse: ExtendedChatMessage = {
      content: shownAnswer,
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
          content: botResponse?.message || '',
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

    if (currentMessage?.type === 'date') {
      return (
        <View style={styles.answerBox}>
          <ActionButton
            title={birthdate ? `Selected date: ${birthdate?.toLocaleDateString()}` : 'Pick your birthdate'}
            icon={<Ionicons name="calendar" size={20} color={Colors.primary[500]} />}
            onPress={() => setIsDateSelectionVisible(true)}
          />
          {isDateSelectionVisible ? (
            <DateTimePicker
              value={birthdate}
              mode="date"
              onChange={(event, selectedDate) => {
                setBirthDate(selectedDate || new Date());
                setIsDateSelectionVisible(false);
              }}
            ></DateTimePicker>
          ) : null}
          <Button type="primary" onPress={() => handleNext(dateObjToISODate(new Date(birthdate)))}>
            CONFIRM
          </Button>
        </View>
      );
    }

    // Answer by options
    if (currentMessage?.type === 'multiple-choice' && currentMessage?.options) {
      return (
        <OptionGroup
          items={currentMessage?.options.map((option) => ({
            value: option.value,
            name: option.label,
          }))}
          onSelectionDone={(name) => {
            handleNext(name);
          }}
          multiple={currentMessage?.multiple ?? false}
        />
      );
    }

    const isLastStep = currentStep === -1;
    if (isLastStep) {
      return (
        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <Button
            type="primary"
            onPress={handleFinish}
            rightIcon={<Ionicons name="arrow-forward" size={24} color={'white'} />}
            loading={isLoading}
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
    return isSkipButtonVisible ? (
      <View>
        <View style={styles.skipButton}>
          <ActionButton
            bgColor={Colors.gray['0']}
            icon={<Ionicons name="arrow-forward" size={24} color={Colors.primary['600']} />}
            onPress={() => navigation.navigate('Main')}
            maxWidth={250}
            title={'Skip'}
            divider
            subText="We will ask some questions to personalize your experience. You can skip this step if you want."
          />
          <CloseIcon
            onPress={() => {
              setIsSkipButtonVisible(false);
            }}
          />
        </View>
        <Divider />
      </View>
    ) : null;
  };

  const renderMessages = () => {
    const getFooter = () => {
      if (isBotWriting) {
        return (
          <ChatMessageComponent
            onWordPress={() => {}}
            isWriting={true}
            chatMessage={{
              sender: ChatMessageSender.assistant,
              content: '',
              timestamp: new Date(),
              id: uuidv4(),
            }}
          />
        );
      }

      return (
        <View style={styles.actionButtons}>
          {messages[messages.length - 1]?.skippable ? (
            <ActionButton
              title="Skip this question"
              icon={<Ionicons name="arrow-forward" size={24} color={Colors.primary['500']} />}
              onPress={handleSkip}
              maxWidth={200}
            />
          ) : (
            <></>
          )}
        </View>
      );
    };

    return (
      <FlatList
        ref={messagesListRef}
        data={messages}
        renderItem={({ item }) => <ChatMessageComponent onWordPress={() => {}} chatMessage={item} />}
        keyExtractor={(item) => item.id || item.timestamp.toString()}
        ListFooterComponent={getFooter()}
        onContentSizeChange={() => {
          messagesListRef.current?.scrollToEnd({ animated: false });
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.messagesContainer}>
        <View>{renderSkipButton()}</View>
        {renderMessages()}
      </View>
      {renderAnswerBox()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
  },
  textInputContainer: {
    justifyContent: 'flex-end',
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
    alignSelf: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  continueButtonChildren: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    alignSelf: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  optionsGroupContainer: {
    flex: 3,
    maxHeight: 400,
  },
  answerBox: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
});

export default PostRegistrationConversation;
