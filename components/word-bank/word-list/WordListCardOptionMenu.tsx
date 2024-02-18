import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import Colors from "../../../theme/colors";
import { StyleSheet, Text, View } from "react-native";
import { TMenuOption } from "./types";
import { TMenuOptionObject } from "./types";

interface WordListCardOptionMenuProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  triggerOption: (option: TMenuOption) => void;
  menuOptions: TMenuOptionObject[]
}

const WordListCardOptionMenu = ({
  menuVisible,
  setMenuVisible,
  triggerOption,
  menuOptions
}: WordListCardOptionMenuProps) => {
  return (
    <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
      <MenuTrigger onPress={() => setMenuVisible(true)}>
        <Ionicons
          size={20}
          name="ellipsis-vertical"
          color={Colors.gray["900"]}
        />
      </MenuTrigger>
      <MenuOptions>
        {menuOptions.map((option, index) => (
          <MenuOption
            key={option.value}
            onSelect={() => triggerOption(option.value)}
            style={[
              styles.optionContainer,
              index === menuOptions.length - 1 && styles.lastOptionContainer,
            ]}
          >
            <View style={styles.optionContent}>
              {option.icon}
              <Text style={styles.option}>{option.label}</Text>
            </View>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomColor: Colors.primary[300],
    borderBottomWidth: 1,
  },
  lastOptionContainer: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 12,
    alignItems: "center",
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    height: 25,
    textAlignVertical: "center",
  },
});

export default WordListCardOptionMenu;
