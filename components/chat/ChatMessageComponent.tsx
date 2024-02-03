import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WritingAnimation from "./WritingAnimation";
import Colors from "../../theme/colors";
import ActionIcon from "../common/ActionIcon";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { ChatMessage, ChatMessageSender } from "../../screens/chat/types";
import Avatar from "../common/Avatar";

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
  console.log(isSentByUser);

  const handleWordPress = (
    event: GestureResponderEvent,
    pressedWord: string
  ) => {
    const word = sanitizeWord(pressedWord);
    onWordPress(word);
  };

  const sanitizeWord = (word: string) => {
    return word.replace(/[^a-zA-Z ]/g, "");
  };

  return (
    <View
      style={[
        styles.messageRoot,
        isSentByUser ? styles.sentMessageRoot : styles.receivedMessageRoot,
      ]}
    >
      {!isSentByUser && (
        <View>
          <Avatar
            src={require("../../assets/bot-avatars/female-v2.png")}
            height={40}
            width={40}
          />
        </View>
      )}
      <View
        style={[
          styles.messageContainer,
          isSentByUser ? styles.sentMsgCard : styles.receivedMsgCard,
        ]}
      >
        {isWriting ? (
          <WritingAnimation />
        ) : (
          <View>
            <View style={styles.messageLineContainer}>
              {lines.map((line, index) => {
                const words = line.split(" ");

                return (
                  <View key={`line-${index}`} style={styles.messageLine}>
                    {words.map((word, index) => {
                      return (
                        <Pressable
                          key={`${chatMessage?.id}-${word}-${index}`}
                          onPress={(event) => handleWordPress(event, word)}
                        >
                          <Text style={styles.message}>{word} </Text>
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
                      name="volume-medium"
                      size={32}
                      color={
                        isSentByUser
                          ? Colors.gray["100"]
                          : Colors.primary["500"]
                      }
                    />
                  }
                  onPress={() => {
                    Speech.speak(chatMessage.content, {
                      language: "en",
                      voice: "",
                    });
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
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
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
  sentMsgCard: {
    backgroundColor: Colors.primary[600],
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 0,
  },
  receivedMsgCard: {
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
    alignSelf: "flex-end",
    fontSize: 11,
    color: Colors.gray[100],
  },
  micSent: {
    alignSelf: "flex-start",
  },
  micReceived: {
    alignSelf: "flex-end",
  },
  messageRoot: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  sentMessageRoot: {
    flexDirection: "row-reverse",
  },
  receivedMessageRoot: {
    flexDirection: "row",
  },
});

export default ChatMessageComponent;
