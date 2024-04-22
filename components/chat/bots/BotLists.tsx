import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { TChatBot } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {
  useCreateNewConversationMutation,
  useGetAllConversationsQuery,
  useGetAvailableBotsQuery,
} from '../api';
import { startConversation } from '../../../redux/chatSlice';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import FetchFailErrorScreen from '../../../screens/common/FetchFailErrorScreen';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';
import BotProfileCard from './BotProfileCard';
import useNotifications from '../../../hooks/useNotifications';
import { isDataResponse } from '../../../services';

const BotLists = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    data: conversations,
    isFetching: isFetchingConversations,
    isError: conversationsNotLoaded,
  } = useGetAllConversationsQuery();
  const { data: bots, isFetching: isFetchingBots, isError: botsNotLoaded } = useGetAvailableBotsQuery();
  const [createConvo, { isLoading: pendingBotCreateResponse, error: createConversationError }] =
    useCreateNewConversationMutation();
  const { add: notify } = useNotifications();

  if (conversationsNotLoaded || botsNotLoaded) {
    return <FetchFailErrorScreen />;
  }

  if (isFetchingConversations || isFetchingBots) {
    return <LoadingIndicator subtext="Get ready to meet your language companion!" />;
  }

  const handleBotPress = async (bot: TChatBot) => {
    if (!pendingBotCreateResponse) {
      const foundExistingConvo = conversations?.find((c) => c.bot.id === bot.id);

      if (foundExistingConvo) {
        navigation.navigate('ChatScreen', { conversationId: foundExistingConvo.id });
        dispatch(startConversation({ bot, conversation: foundExistingConvo.id }));
        return;
      }
      const response = await createConvo(bot.id);
      if (!isDataResponse(response)) {
        notify({
          body: generateErrorResponseMessage(createConversationError, 'Error creating conversation'),
          type: 'error',
        });
        return;
      }

      const data = response.data;
      const convoId = data.id;
      if (!convoId) {
        return;
      }
      navigation.navigate('ChatScreen', { conversationId: convoId });
      dispatch(startConversation({ bot, conversation: data?.id }));
    }
  };

  const renderBots = () => {
    return (
      <FlatList
        data={bots}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleBotPress(item)} style={styles.profile}>
            <BotProfileCard bot={item} />
          </Pressable>
        )}
        contentContainerStyle={styles.botListContainer}
        keyExtractor={(item) => item.id}
      />
    );
  };

  return <View>{renderBots()}</View>;
};

const styles = StyleSheet.create({
  profile: {
    marginHorizontal: 12,
  },
  botListContainer: {
    gap: 15,
    paddingVertical: 16,
  },
});

export default BotLists;
