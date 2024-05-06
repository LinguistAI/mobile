import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import ChatMessageComponent from '../../components/chat/ChatMessageComponent';
import ChatTextInputContainer from '../../components/chat/ChatTextInputContainer';
import WordInfoCard from '../../components/word-bank/WordInfoCard';
import { ChatMessage, ChatMessageSender } from './types';
import ChatHeader from '../../components/chat/ChatHeader';
import { useDisableBottomTab } from '../../hooks/useDisableBottomTab';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import { useSelector } from 'react-redux';
import { selectCurrentBot } from '../../redux/chatSelectors';
import { getChatWalkthroughStarted, saveChatWalkthroughStarted } from './utils';
import { useChatMessages } from './useChatMessages';
import { INITIAL_PAGE, DEFAULT_PAGE_SIZE } from './constants';
import Colors from '../../theme/colors';
import { add } from 'date-fns';
import Card from '../../components/common/Card';

const WalkThroughableView = walkthroughable(View);

interface ChatScreenProps {
  route: any;
}

const ChatScreen = ({ route }: ChatScreenProps) => {
  const conversationId = route.params.conversationId as string;
  const currentBot = useSelector(selectCurrentBot);
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const {
    addMessage,
    isLoadingMessages,
    messages,
    isSendingMessage,
    responseNotReceived,
    hasMoreMessages,
    addedMessages,
    isFirstPage,
  } = useChatMessages({
    conversationId,
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [selectedWord, setSelectedWord] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { start } = useCopilot();
  useDisableBottomTab();

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

  useEffect(() => {
    if (isFirstPage) {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }
  }, [isFirstPage]);

  useEffect(() => {
    if (addedMessages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }
  }, [addedMessages.length]);

  const isPending = isLoadingMessages || isSendingMessage;

  const onSend = async (text: string) => {
    if (!text) {
      return;
    }

    const chatMessage: ChatMessage = {
      sender: ChatMessageSender.user,
      content: text,
      timestamp: new Date(),
    };

    await addMessage(chatMessage);
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

  const renderPendingMessage = () => {
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
    return (
      <CopilotStep
        name="chat-message-list"
        order={6}
        text="Your messages will apear here. You can click on a word to see the word's definitions."
        active={messages.length > 0}
      >
        <WalkThroughableView style={styles.messagesContainer}>
          <ScrollView
            ref={scrollViewRef}
            automaticallyAdjustContentInsets={true}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  if (hasMoreMessages && !isLoadingMessages) {
                    const newPage = currentPage + Math.floor(addedMessages.length / DEFAULT_PAGE_SIZE) + 1;
                    setCurrentPage(newPage);
                  }
                }}
              />
            }
          >
            {!hasMoreMessages && !isLoadingMessages && (
              <View style={{ marginBottom: 32 }}>
                <Card
                  style={{
                    width: Dimensions.get('screen').width / 2,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <View style={{ padding: 16 }}>
                    <Text style={{ textAlign: 'center' }}>You reached the start of the conversation!</Text>
                  </View>
                </Card>
              </View>
            )}
            {hasMoreMessages && !isLoadingMessages && (
              <View style={{ marginBottom: 32 }}>
                <Card
                  style={{
                    width: Dimensions.get('screen').width / 2,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <View style={{ padding: 8 }}>
                    <Text style={{ textAlign: 'center', fontSize: 13, color: Colors.gray[600] }}>
                      Pull to load more messages...
                    </Text>
                  </View>
                </Card>
              </View>
            )}
            {isLoadingMessages && (
              <View>
                <ActivityIndicator size="large" color={Colors.primary[600]} />
              </View>
            )}
            {messages
              ?.filter((m) => m)
              ?.map((item) => (
                <ChatMessageComponent
                  onWordPress={handleWordPress}
                  key={item.id || item.timestamp.toString()}
                  chatMessage={item}
                />
              ))}

            {renderPendingMessage()}
          </ScrollView>
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
    flex: 10,
  },
});

export default ChatScreen;
