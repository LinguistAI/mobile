import { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ChatMessageComponent from "../components/ChatMessageComponent";
import ChatTextInputContainer from "../containers/Chat/ChatTextInputContainer";
import WordInfoCard from "../containers/Chat/WordInfoCard";
import { useChatMessages } from "../hooks/useChatMessages";
import { ChatMessage, ChatMessageSender } from "../types/common";

const ChatScreen = () => {
  const { addMessage, isSyncing, messages, removeMessage } = useChatMessages(
    {}
  );
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onSend = async (text: string) => {
    const chatMessage: ChatMessage = {
      sender: ChatMessageSender.user,
      content: text,
      timestamp: new Date(),
    };

    addMessage(chatMessage);
    // TODO: Send the message to the server
  };

  const onSelectedWordDismiss = () => {
    setSelectedWord("");
    setModalVisible(false);
  };

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    setModalVisible(true);
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
          <WordInfoCard
            exampleSentences={["This is an example sentence"]}
            meanings={["This is a meaning"]}
            selectedWord={selectedWord}
            onDismiss={onSelectedWordDismiss}
          />
        </View>
      </Modal>
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
          ListFooterComponent={
            // TODO: Render ONLY if the assistant is writing
            <ChatMessageComponent
              onWordPress={handleWordPress}
              isWriting={true}
              chatMessage={{
                sender: ChatMessageSender.assistant,
                content: "",
                timestamp: new Date(),
              }}
            />
          }
          keyExtractor={(item) => item.timestamp.toString()}
        />
      </View>
      <View style={styles.textInputContainer}>
        <ChatTextInputContainer onSend={onSend} isPending={isSyncing} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  messagesContainer: {
    flex: 12,
    marginHorizontal: 16,
    marginVertical: 50,
    height: "80%",
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
