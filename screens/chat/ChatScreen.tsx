import { useRef, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, View } from 'react-native';
import ChatMessageComponent from '../../components/chat/ChatMessageComponent';
import ChatTextInputContainer from '../../components/chat/ChatTextInputContainer';
import WordInfoCard from '../../components/word-bank/WordInfoCard';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ChatMessage, ChatMessageSender } from './types';
import ChatHeader from '../../components/chat/ChatHeader';
import { useDisableBottomTab } from '../../hooks/useDisableBottomTab';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

interface ChatScreenProps {
  route: any;
}

const ChatScreen = ({ route }: ChatScreenProps) => {
  const conversationId = route.params.conversationId as string;
  const {
    addMessage,
    isLoadingInitialMessages,
    isFetchingMore: isLoadingMore,
    messages,
    isSendingMessage,
    responseNotReceived,
    fetchEarlier,
  } = useChatMessages({
    conversationId,
  });
  const [selectedWord, setSelectedWord] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const messagesList = useRef<FlatList>(null);
  useDisableBottomTab();

  const isPending = isLoadingMore || isSendingMessage;

  const onSend = async (text: string) => {
    if (!text) {
      return;
    }

    const chatMessage: ChatMessage = {
      sender: ChatMessageSender.user,
      content: text,
      timestamp: new Date(),
      id: uuidv4(),
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
            id: uuidv4(),
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
            id: uuidv4(),
          }}
        />
      );
    }

    return <></>;
  };

  const renderMessages = () => {
    // if (isLoadingMore) {
    //   return (
    //     <View style={styles.centeredView}>
    //       <ActivityIndicator size="large" />
    //     </View>
    //   );
    // }

    return (
      <View style={styles.messagesContainer}>
        <FlatList
          onStartReached={() => {
            if (!isLoadingMore && !isLoadingInitialMessages) {
              fetchEarlier(messages[0].id);
            }
          }}
          ref={messagesList}
          data={messages}
          renderItem={({ item }) => (
            <ChatMessageComponent
              onWordPress={handleWordPress}
              key={item.id || item.timestamp.toString()}
              chatMessage={item}
            />
          )}
          ListFooterComponent={renderLastChatMessage()}
          keyExtractor={(item) => item.id || item.timestamp.toString()}
          onContentSizeChange={() => messagesList.current?.scrollToEnd({ animated: false })}
        />
      </View>
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
      <View style={styles.header}>
        <ChatHeader />
      </View>
      {renderMessages()}
      <View style={styles.textInputContainer}>
        <ChatTextInputContainer onSend={onSend} isPending={isPending} />
      </View>
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
    marginTop: 10,
    marginHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
});

export default ChatScreen;
