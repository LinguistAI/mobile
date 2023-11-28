import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ChatMessageComponent from "../components/ChatMessageComponent";
import ChatTextInputContainer from "../containers/Chat/ChatTextInputContainer";
import { useChatMessages } from "../hooks/useChatMessages";
import { ChatMessage, ChatMessageSender } from "../types/common";

const ChatScreen = () => {
  const { addMessage, isSyncing, messages, removeMessage } = useChatMessages(
    {}
  );

  const onSend = async (text: string) => {
    const chatMessage: ChatMessage = {
      sender: ChatMessageSender.user,
      content: text,
      timestamp: new Date(),
    };

    addMessage(chatMessage);
    // TODO: Send the message to the server
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <ChatMessageComponent
              key={item.id || item.timestamp.toString()}
              chatMessage={item}
            />
          )}
          ListFooterComponent={
            // TODO: Render ONLY if the assistant is writing
            <ChatMessageComponent
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
});

export default ChatScreen;
