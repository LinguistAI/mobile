import { useDispatch, useSelector } from 'react-redux';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import Avatar from '../../common/Avatar';
import { useNavigation } from '@react-navigation/native';
import ActionIcon from '../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { selectCurrentBot, selectCurrentConversation } from '../../../redux/chatSelectors';
import QuizStartButton from '../QuizStartButton';
import ChatMenu from './ChatMenu';
import { useEffect, useState } from 'react';
import { ChatOption } from '../types';
import useNotifications from '../../../hooks/useNotifications';
import { useClearConversationMutation, useGetConversationQuery } from '../api';
import ActiveWordsModal from '../ActiveWordsModal';
import { updateSelectedConversation } from '../../../redux/chatSlice';
import ActiveWordsRow from './ActiveWordsRow';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

const WalkThroughableView = walkthroughable(View);

const ChatHeader = () => {
  const dispatch = useDispatch();
  const [chatMenuVisible, setChatMenuVisible] = useState(false);
  const [activeWordsVisible, setActiveWordsVisible] = useState(false);
  const currentBot = useSelector(selectCurrentBot);
  const conversation = useSelector(selectCurrentConversation);
  const navigation = useNavigation();
  const { add } = useNotifications();
  const { data: latestConvoDetails } = useGetConversationQuery(conversation?.id, {
    skip: !conversation,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [clearConvo, {}] = useClearConversationMutation();

  useEffect(() => {
    if (latestConvoDetails) {
      dispatch(updateSelectedConversation({ conversation: latestConvoDetails }));
    }
  }, [latestConvoDetails]);

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
      <View style={styles.headerRowRoot}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <View style={styles.avatarContainer}>
              <ActionIcon icon={<Ionicons size={28} name="arrow-back" />} onPress={handleGoBack} />
              <Avatar src={currentBot?.profileImage} height={40} width={40} />
            </View>
            <Text style={styles.botName}>{currentBot?.name?.trim().slice(0, 13)}...</Text>
          </View>
          <CopilotStep
            name="chat-header-quiz-button"
            order={2}
            text={`Quiz button will be enabled after you chat with the bot for some time.`}
          >
            <WalkThroughableView>
              <View style={styles.rightContainer}>
                <QuizStartButton />
                <ChatMenu
                  menuVisible={chatMenuVisible}
                  setMenuVisible={setChatMenuVisible}
                  triggerOption={triggerOption}
                />
                {activeWordsVisible && (
                  <ActiveWordsModal
                    onBackdropPress={() => setActiveWordsVisible(false)}
                    visible={activeWordsVisible}
                  />
                )}
              </View>
            </WalkThroughableView>
          </CopilotStep>
        </View>
      </View>
      <CopilotStep
        name="chat-header-active-words"
        order={3}
        text={`These are the words ${
          currentBot?.name ?? 'the chatbot'
        } is going to use more frequently during this conversation.`}
      >
        <WalkThroughableView>
          <View style={styles.activeWordsRow}>
            <ActiveWordsRow onRowPress={() => setActiveWordsVisible(true)} />
          </View>
        </WalkThroughableView>
      </CopilotStep>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderBottomColor: Colors.primary[600],
    borderBottomWidth: 2,
    backgroundColor: Colors.gray[0],
    zIndex: 9999,
    minHeight: 80,
  },
  headerRowRoot: {
    marginVertical: 8,
    display: 'flex',
    justifyContent: 'center',
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
  activeWordsRow: {
    marginVertical: 8,
  },
});

export default ChatHeader;
