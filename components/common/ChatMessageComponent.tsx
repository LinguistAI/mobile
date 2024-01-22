import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WritingAnimation from "../chat/WritingAnimation";
import Colors from "../../theme/colors";
import { ChatMessage, ChatMessageSender } from "../../screens/common";
import ActionIcon from "./ActionIcon";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

interface ChatMessageComponentProps {
  chatMessage: ChatMessage;
  onWordPress: (word: string) => void;
  isWriting?: boolean;
}

const ChatMessageComponent = (props: ChatMessageComponentProps) => {
  const { chatMessage, isWriting, onWordPress } = props;

  const timestamp = new Date(chatMessage.timestamp);
  const lines = chatMessage.content.split("\n");
  const isSentByUser = chatMessage.sender === ChatMessageSender.user;

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

  return (
    <View
      style={[styles.container, isSentByUser ? styles.sent : styles.received]}
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
          <View style={styles.bottomRow}>
            <View style={isSentByUser ? styles.micSent : styles.micReceived}>
              <ActionIcon
                icon={
                  <Ionicons
                    name="mic-circle"
                    size={36}
                    color={
                      isSentByUser ? Colors.gray["100"] : Colors.primary["500"]
                    }
                  />
                }
                onPress={() => {
                  Speech.speak(chatMessage.content, { language: "en" });
                }}
              />
            </View>
            <Text
              style={
                isSentByUser ? styles.timestampSent : styles.timestampReceived
              }
            >
              {timestamp?.toLocaleTimeString() || ""}
            </Text>
          </View>
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
    flexWrap: "wrap",
  },
  messageLine: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
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
  micSent: {
    alignSelf: "flex-start",
  },
  micReceived: {
    alignSelf: "flex-end",
  },
});

export default ChatMessageComponent;
