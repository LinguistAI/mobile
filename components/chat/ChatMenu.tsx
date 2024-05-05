import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { ChatOption, ChatOptionObject } from './types';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../redux/chatSelectors';
import { useNavigation } from '@react-navigation/native';
import useNotifications from '../../hooks/useNotifications';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import { useEffect } from 'react';

const WalkThroughableView = walkthroughable(View);

interface ChatMenuProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  triggerOption: (value: ChatOption) => void;
}

const ChatMenu = ({ menuVisible, setMenuVisible, triggerOption }: ChatMenuProps) => {
  const conversation = useSelector(selectCurrentConversation);
  const navigation = useNavigation();
  const { add } = useNotifications();

  if (!conversation) {
    navigation.navigate('Conversations');
    add({ body: 'Please start a conversation first!', type: 'warning' });
    return;
  }

  const menuOptions: ChatOptionObject[] = [
    {
      icon: <Ionicons name="trash" size={20} color={Colors.red[500]} />,
      value: ChatOption.CLEAR_CONVERSATION,
      label: 'Clear Conversation',
    },
    {
      icon: <Ionicons name="book" size={20} color={Colors.primary[500]} />,
      value: ChatOption.ACTIVE_WORDS,
      label: 'See Active Words',
    },
  ];

  return (
    <Menu opened={menuVisible} onBackdropPress={() => setMenuVisible(false)}>
      <MenuTrigger onPress={() => setMenuVisible(true)}>
        <Ionicons size={24} name="ellipsis-vertical" color={Colors.primary['900']} />
      </MenuTrigger>
      <MenuOptions>
        <CopilotStep
          name="chat-menu-options"
          order={4}
          text="You can click on 'See Active Words' to see the active words used in this conversation.  Active words will be used by the chatbot more frequently so that you can learn bout them. The words are selected from your wordlists on a daily basis."
        >
          <WalkThroughableView>
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
          </WalkThroughableView>
        </CopilotStep>
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

export default ChatMenu;
