import { Pressable, StyleSheet, Text, View } from "react-native";
import WritingAnimation from "../containers/Chat/WritingAnimation";
import Colors from "../theme/colors";
import { ChatMessage, ChatMessageSender } from "../types/common";

interface ChatMessageComponentProps {
  chatMessage: ChatMessage;
  isWriting?: boolean;
}

const ChatMessageComponent = (props: ChatMessageComponentProps) => {
  const { chatMessage, isWriting } = props;
  // TODO: Add message time to the chat message

  // TODO: To display the message as it is written create an array of
  const words = chatMessage.content.split(" ");

  const sanitizeWord = (word: string) => {
    return word.replace(/[^a-zA-Z ]/g, "");
  };

  return (
    <View
      style={[
        styles.container,
        chatMessage.sender == ChatMessageSender.user
          ? styles.sent
          : styles.received,
      ]}
    >
      {isWriting ? (
        <WritingAnimation />
      ) : (
        <View style={styles.messageContainer}>
          {words.map((word) => {
            return (
              <Pressable onPress={() => console.log(sanitizeWord(word))}>
                <Text style={styles.message}>{word} </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    minWidth: "10%",
    borderRadius: 12,
    padding: 8,
    marginVertical: 4,
  },
  messageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontSize: 18,
  },
});

export default ChatMessageComponent;
