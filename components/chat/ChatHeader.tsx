import { useSelector } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';
import Avatar from '../common/Avatar';
import { useNavigation } from '@react-navigation/native';
import ActionIcon from '../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { selectCurrentBot, selectCurrentConversation } from '../../redux/chatSelectors';
import QuizStartButton from './QuizStartButton';
import ChatMenu from './ChatMenu';
import { useEffect, useState } from 'react';
import { ChatOption } from './types';
import useNotifications from '../../hooks/useNotifications';
import { useClearConversationMutation } from './api';
import ActiveWordsModal from './ActiveWordsModal';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';

const WalkThroughableView = walkthroughable(View);

const ChatHeader = () => {
  const [chatMenuVisible, setChatMenuVisible] = useState(false);
  const [activeWordsVisible, setActiveWordsVisible] = useState(false);
  const currentBot = useSelector(selectCurrentBot);
  const conversation = useSelector(selectCurrentConversation);
  const navigation = useNavigation();
  const { add } = useNotifications();
  const [clearConvo, {}] = useClearConversationMutation();
  const { copilotEvents } = useCopilot();
  copilotEvents.on('stepChange', (step) => {
    if (step?.order === 3 || step?.order === 4) {
      setChatMenuVisible(true);
    }
    if (step?.order === 5) {
      setChatMenuVisible(false);
    }
  });
  const handleGoBack = () => {
    navigation.navigate('Conversations');
  };

  if (!conversation) {
    handleGoBack();
    add({ body: 'Please start a conversation first!', type: 'warning' });
    return;
  }

  const triggerOption = (value: ChatOption) => {
    switch (value) {
      case ChatOption.ACTIVE_WORDS:
        setActiveWordsVisible(true);
        break;
      case ChatOption.CLEAR_CONVERSATION:
        clearConvo(conversation.id);
        navigation.goBack();
        add({
          type: 'success',
          body: 'Cleared the conversation.',
        });
        break;
      default:
        break;
    }

    setChatMenuVisible(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.avatarContainer}>
            <ActionIcon icon={<Ionicons size={28} name="arrow-back" />} onPress={handleGoBack} />
            <Avatar src={currentBot?.profileImage} height={40} width={40} />
          </View>
          <Text style={styles.botName}>{currentBot?.name?.slice(0, 12).trim()}...</Text>
        </View>
        <View style={styles.rightContainer}>
          <CopilotStep
            name="chat-quiz-button"
            order={2}
            text="The 'Start Quiz' button will be enabled after you chat for a certain amount with the bot. It will send you to a quiz to test your knowledge of the words used in the conversation."
          >
            <WalkThroughableView>
              <QuizStartButton />
            </WalkThroughableView>
          </CopilotStep>
          <CopilotStep name="chat-options-menu" order={3} text="This is the options menu for this chat.">
            <WalkThroughableView>
              <ChatMenu
                menuVisible={chatMenuVisible}
                setMenuVisible={setChatMenuVisible}
                triggerOption={triggerOption}
              />
            </WalkThroughableView>
          </CopilotStep>
          <ActiveWordsModal setVisible={setActiveWordsVisible} visible={activeWordsVisible} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    borderBottomColor: Colors.primary[600],
    borderBottomWidth: 2,
    zIndex: 9999,
    backgroundColor: Colors.gray[0],
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatHeader;
