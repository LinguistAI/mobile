import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ActionIcon from "../../components/ActionIcon";
import MultilineTextInput from "../../components/input/MultilineTextInput";
import Colors from "../../theme/colors";

interface ChatTextInputContainerProps {
  isPending: boolean;
  onSend: (text: string) => void;
}

const ChatTextInputContainer = (props: ChatTextInputContainerProps) => {
  const [text, setText] = useState("");

  return (
    <View style={styles.innerBorder}>
      <View style={styles.innerContainer}>
        <View style={{ flex: 8 }}>
          <MultilineTextInput
            onChangeText={(text) => setText(text)}
            value={text}
            maxHeight={60}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ActionIcon
            disabled={props.isPending}
            icon={
              <Ionicons
                name="send"
                size={24}
                color={props.isPending ? Colors.gray[300] : Colors.primary[600]}
              />
            }
            onPress={() => {
              props.onSend(text);
              setText("");
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  innerBorder: {
    borderWidth: 2,
    borderColor: Colors.gray[600],
    borderRadius: 48,
    paddingHorizontal: 16,
  },
});

export default ChatTextInputContainer;
