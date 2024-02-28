import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ChatMessageComponent from "../../components/chat/ChatMessageComponent";
import ChatTextInputContainer from "../../components/chat/ChatTextInputContainer";
import WordInfoCard from "../../components/chat/WordInfoCard";
import { useChatMessages } from "../../hooks/useChatMessages";
import { ChatMessage, ChatMessageSender } from "./types";
import { selectCurrentBot } from "../../slices/chatSelectors";
import { useSelector } from "react-redux";
import ChatHeader from "../../components/chat/ChatHeader";

interface ChatScreenProps {
  route: any
}

const ChatScreen = ({ route }: ChatScreenProps) => {
  const conversationId = route.params.conversationId as string;
  const { 
    addMessage,
    isLoadingMessages,
    messages,
    isSendingMessage,
    responseNotReceived
  } = useChatMessages({conversationId});
  const [selectedWord, setSelectedWord] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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

    addMessage(chatMessage);
  };

  const onSelectedWordDismiss = () => {
    setSelectedWord("");
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
            content: "Something went wrong...",
            timestamp: new Date(),
          }}
        />
      )
    }

    if (isSendingMessage) {
      return (
        <ChatMessageComponent
          onWordPress={handleWordPress}
          isWriting={true}
          chatMessage={{
            sender: ChatMessageSender.assistant,
            content: "",
            timestamp: new Date(),
          }}
        />
      )
    }

    return <></>
  }

  const renderMessages = () => {
    if (isLoadingMessages) {
      return (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <View style={styles.messagesContainer}>
        <FlatList
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
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onSelectedWordDismiss}
      >
        <View style={styles.centeredView}>
          <WordInfoCard
            selectedWord={selectedWord}
            onDismiss={onSelectedWordDismiss}
          />
        </View>
      </Modal>
      <ChatHeader />
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
    marginBottom: 16,
    marginHorizontal: 16,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 48,
  },
  messagesContainer: {
    flex: 12,
    marginTop: 40,
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});

export default ChatScreen;
