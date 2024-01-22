import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ActionIcon from "../common/ActionIcon";
import MultilineTextInput from "../common/input/MultilineTextInput";
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
        <View style={{ flex: 6 }}>
          <MultilineTextInput
            onChangeText={(text) => setText(text)}
            value={text}
            maxHeight={60}
          />
        </View>
        {text ? (
          <View style={{ flex: 1 }}>
            <ActionIcon
              disabled={props.isPending}
              icon={
                <Ionicons
                  name="send"
                  size={32}
                  color={
                    props.isPending ? Colors.gray[300] : Colors.primary[600]
                  }
                />
              }
              onPress={() => {
                props.onSend(text);
                setText("");
              }}
            />
          </View>
        ) : (
          <View>
            <ActionIcon
              icon={
                <Ionicons name="mic" size={32} color={Colors.primary[600]} />
              }
              onPress={() => {}}
            />
          </View>
        )}
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
