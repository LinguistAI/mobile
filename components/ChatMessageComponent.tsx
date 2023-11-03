import { StyleSheet, Text, View } from "react-native";
import Colors from "../theme/colors";
import { ChatMessage, ChatMessageSender } from "../types/common";

interface ChatMessageComponentProps {
  chatMessage: ChatMessage;
}

const ChatMessageComponent = (props: ChatMessageComponentProps) => {
  const { chatMessage } = props;
  // TODO: Add message time to the chat message

  return (
    <View
      style={[
        styles.container,
        chatMessage.sender == ChatMessageSender.user
          ? styles.sent
          : styles.received,
      ]}
    >
      <Text style={styles.message}>{chatMessage.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 8,
    marginVertical: 4,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary[600],
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: Colors.gray[700],
  },
  message: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatMessageComponent;
