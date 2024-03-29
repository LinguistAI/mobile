import { useEffect, useState } from "react";
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
import { sendChatMessage } from "../../services/chat/Chat.service";
import { useMutation } from "@tanstack/react-query";
import useUser from "../../hooks/auth/useUser";
import { ChatMessage, ChatMessageSender } from "./types";

const ChatScreen = () => {
  const { addMessage, isSyncing, messages } = useChatMessages({});
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { user } = useUser();

  const { mutate: sendMessageMutate, isPending: isSendingMessage } =
    useMutation({
      mutationKey: ["chat", "send"],
      mutationFn: (chatMessage: ChatMessage) =>
        sendChatMessage(chatMessage, user.email),
      onError: (error) => console.log(error),
      onSuccess: (data) => {
        const response = data.data;
        if (!response || !response.data) {
          return;
        }
        addMessage({
          content: response.data.answer,
          sender: ChatMessageSender.assistant,
          timestamp: new Date(),
        });
      },
    });

  const isPending = isSyncing || isSendingMessage;

  const onSend = async (text: string) => {
    if (!text) {
      return;
    }

    const chatMessage: ChatMessage = {
      sender: ChatMessageSender.user,
      content: text,
      timestamp: new Date(),
    };

    addMessage(chatMessage); // Local update
    sendMessageMutate(chatMessage); // Server update
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
      {isSyncing ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
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
              isSendingMessage ? (
                <ChatMessageComponent
                  onWordPress={handleWordPress}
                  isWriting={true}
                  chatMessage={{
                    sender: ChatMessageSender.assistant,
                    content: "",
                    timestamp: new Date(),
                  }}
                />
              ) : (
                <></>
              )
            }
            keyExtractor={(item) => item.id || item.timestamp.toString()}
          />
        </View>
      )}

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
