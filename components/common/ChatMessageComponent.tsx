import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WritingAnimation from "../chat/WritingAnimation";
import Colors from "../../theme/colors";
import { ChatMessage, ChatMessageSender } from "../../types/common";

interface ChatMessageComponentProps {
  chatMessage: ChatMessage;
  onWordPress: (word: string) => void;
  isWriting?: boolean;
}

const ChatMessageComponent = (props: ChatMessageComponentProps) => {
  const { chatMessage, isWriting, onWordPress } = props;

  const timestamp = new Date(chatMessage.timestamp);

  const handleWordPress = (
    event: GestureResponderEvent,
    pressedWord: string
  ) => {
    const { locationX, locationY } = event.nativeEvent;
    const word = sanitizeWord(pressedWord);
    onWordPress(word);
  };

  const sanitizeWord = (word: string) => {
    return word.replace(/[^a-zA-Z ]/g, "");
  };

  const lines = chatMessage.content.split("\n");

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
        <View>
          <View style={styles.messageLineContainer}>
            {lines.map((line) => {
              const words = line.split(" ");

              return (
                <View style={styles.messageLine}>
                  {words.map((word) => {
                    return (
                      <Pressable
                        key={chatMessage?.id}
                        onPress={(event) => handleWordPress(event, word)}
                      >
                        <Text key={chatMessage?.id} style={styles.message}>
                          {word}{" "}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </View>
          <Text
            style={
              chatMessage.sender == ChatMessageSender.user
                ? styles.timestampSent
                : styles.timestampReceived
            }
          >
            {timestamp?.toLocaleTimeString() || ""}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    minWidth: "20%",
    borderRadius: 12,
    padding: 8,
    marginVertical: 4,
  },
  messageLineContainer: {
    flexDirection: "column",
  },
  messageLine: {
    flexDirection: "row",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary[600],
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 0,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: Colors.gray[700],
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  message: {
    color: "white",
    fontSize: 18,
  },
  timestampSent: {
    alignSelf: "flex-end",
    fontSize: 11,
    color: Colors.gray[700],
  },
  timestampReceived: {
    alignSelf: "flex-start",
    fontSize: 11,
    color: Colors.gray[700],
  },
});

export default ChatMessageComponent;
