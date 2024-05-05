import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ChatMessageComponent from '../../components/chat/ChatMessageComponent';
import ChatTextInputContainer from '../../components/chat/ChatTextInputContainer';
import WordInfoCard from '../../components/word-bank/WordInfoCard';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ChatMessage, ChatMessageSender } from './types';
import ChatHeader from '../../components/chat/ChatHeader';
import { useDisableBottomTab } from '../../hooks/useDisableBottomTab';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import { useSelector } from 'react-redux';
import { selectCurrentBot } from '../../redux/chatSelectors';
import { getChatWalkthroughStarted, saveChatWalkthroughStarted } from './utils';

const WalkThroughableView = walkthroughable(View);

interface ChatScreenProps {
  route: any;
}

const ChatScreen = ({ route }: ChatScreenProps) => {
  const conversationId = route.params.conversationId as string;
  const currentBot = useSelector(selectCurrentBot);
  const { addMessage, isLoadingMessages, messages, isSendingMessage, responseNotReceived } = useChatMessages({
    conversationId,
  });
  const [selectedWord, setSelectedWord] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const messagesList = useRef<FlatList>(null);
  const { start, goToNth, currentStepNumber } = useCopilot();
  useDisableBottomTab();

  console.log('currentStepNumber', currentStepNumber);
  const isPending = isLoadingMessages || isSendingMessage;

  useEffect(() => {
    const startChatWalkthrough = async () => {
      const started = await getChatWalkthroughStarted();
      if (started) return;

      if (messages.length === 0) {
        start();
        saveChatWalkthroughStarted();
        return;
      } else {
        start('chat-message-list');
      }
    };

    startChatWalkthrough();

    return () => {
      setModalVisible(false);
      setSelectedWord('');
    };
  }, [messages]);

  const onSend = async (text: string) => {
    if (!text) {
      return;
    }

    const chatMessage: ChatMessage = {
      sender: ChatMessageSender.user,
      content: text,
      timestamp: new Date(),
    };

    const res = await addMessage(chatMessage);
  };

  const onSelectedWordDismiss = () => {
    setSelectedWord('');
    setModalVisible(false);
  };

  const handleWordPress = (word: string) => {
    if (!word) {
      return;
    }
    setSelectedWord(word);
    setModalVisible(true);
  };

  const renderLastChatMessage = () => {
    if (responseNotReceived) {
      return (
        <ChatMessageComponent
          onWordPress={() => {}}
          isWriting={false}
          chatMessage={{
            sender: ChatMessageSender.assistant,
            content: 'Something went wrong...',
            timestamp: new Date(),
          }}
        />
      );
    }

    if (isSendingMessage) {
      return (
        <ChatMessageComponent
          onWordPress={handleWordPress}
          isWriting={true}
          chatMessage={{
            sender: ChatMessageSender.assistant,
            content: '',
            timestamp: new Date(),
          }}
        />
      );
    }

    return <></>;
  };

  const renderMessages = () => {
    if (isLoadingMessages) {
      return (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <CopilotStep
        name="chat-message-list"
        order={6}
        text="Your messages will apear here. You can click on a word to see the word's definitions."
        active={messages.length > 0}
      >
        <WalkThroughableView style={styles.messagesContainer}>
          <FlatList
            ref={messagesList}
            data={messages}
            automaticallyAdjustKeyboardInsets={true}
            renderItem={({ item }) => (
              <ChatMessageComponent
                onWordPress={handleWordPress}
                key={item.id || item.timestamp.toString()}
                chatMessage={item}
              />
            )}
            ListFooterComponent={renderLastChatMessage()}
            keyExtractor={(item) => item.id || item.timestamp.toString()}
            onContentSizeChange={() => {
              messagesList.current?.scrollToEnd({ animated: false });
            }}
          />
        </WalkThroughableView>
      </CopilotStep>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onSelectedWordDismiss}
      >
        <View style={styles.centeredView}>
          <WordInfoCard selectedWord={selectedWord} onDismiss={onSelectedWordDismiss} />
        </View>
      </Modal>
      <CopilotStep
        name="chat-screen"
        order={1}
        text={`This is the chat screen, you are talking with "${
          currentBot?.name || 'a chatbot'
        }". You can ask questions or just chat with it.`}
      >
        <WalkThroughableView>
          <ChatHeader />
        </WalkThroughableView>
      </CopilotStep>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexContainer}
      >
        <View style={styles.flexContainer}>
          {renderMessages()}
          <CopilotStep name="chat-text-input" order={5} text="Type in a message to start chatting!">
            <WalkThroughableView>
              <View style={styles.textInputContainer}>
                <ChatTextInputContainer onSend={onSend} isPending={isPending} />
              </View>
            </WalkThroughableView>
          </CopilotStep>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flex: 1,
  },
  textInputContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 8,
    paddingBottom: 8,
  },
  messagesContainer: {
    flex: 10,
    marginHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  flexContainer: {
    flex: 8,
  },
});

export default ChatScreen;
