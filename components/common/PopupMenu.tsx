import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Option {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface PopupMenuProps<T extends Option> {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  triggerOption: (option: any) => void;
  menuOptions: T[];
}

const PopupMenu = <T extends Option>({
  menuVisible,
  setMenuVisible,
  triggerOption,
  menuOptions,
}: PopupMenuProps<T>) => {
  return (
    <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
      <MenuTrigger onPress={() => setMenuVisible(true)}></MenuTrigger>
      <MenuOptions>
        {menuOptions.map((option, index) => (
          <MenuOption
            key={option.value}
            onSelect={() => triggerOption(option.value)}
            style={[styles.optionContainer, index === menuOptions.length - 1 && styles.lastOptionContainer]}
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
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 12,
    alignItems: 'center',
  },
  option: {
    fontSize: 14,
    fontWeight: 'bold',
    height: 20,
    textAlignVertical: 'center',
  },
});

export default PopupMenu;
