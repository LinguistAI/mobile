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

export const MENU_OPTIONS: TMenuOptionObject[] = [
  {
    label: "Edit",
    value: TMenuOption.EDIT,
    icon: <Ionicons name="create-outline" size={20} color={Colors.blue[600]} />,
  },
  {
    label: "Favorite",
    value: TMenuOption.FAVORITE,
    icon: (
      <Ionicons name="heart-outline" size={20} color={Colors.primary[600]} />
    ),
  },
  {
    label: "Delete",
    value: TMenuOption.DELETE,
    icon: <Ionicons name="trash-outline" size={20} color={Colors.red[600]} />,
  },
  {
    label: "Pin",
    value: TMenuOption.PIN,
    icon: <Ionicons name="pin-outline" size={20} color="black" />,
  },
  {
    label: "Cancel",
    value: TMenuOption.CANCEL,
    icon: (
      <Ionicons
        name="close-circle-outline"
        size={20}
        color={Colors.gray[600]}
      />
    ),
  },
];

interface WordListCardOptionMenuProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  triggerOption: (option: TMenuOption) => void;
}
const WordListCardOptionMenu = ({
  menuVisible,
  setMenuVisible,
  triggerOption,
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
        {MENU_OPTIONS.map((option, index) => (
          <MenuOption
            key={option.value}
            onSelect={() => triggerOption(option.value)}
            style={[
              styles.optionContainer,
              index === MENU_OPTIONS.length - 1 && styles.lastOptionContainer,
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
