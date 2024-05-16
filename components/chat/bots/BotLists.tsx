import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { type TChatBot } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
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
import { selectCurrentLanguage } from '../../../redux/chatSelectors';

const BotLists = () => {
  const userLanguageCode = useSelector(selectCurrentLanguage);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    isError: conversationsNotLoaded,
  } = useGetAllConversationsQuery(userLanguageCode);
  const { data: bots, isLoading: isLoadingBots, isError: botsNotLoaded } = useGetAvailableBotsQuery(userLanguageCode);
  const [createConvo, { isLoading: pendingBotCreateResponse, error: createConversationError }] =
    useCreateNewConversationMutation();
  const { add: notify } = useNotifications();

  if (conversationsNotLoaded || botsNotLoaded) {
    return <FetchFailErrorScreen />;
  }

  if (isLoadingConversations || isLoadingBots) {
    return <LoadingIndicator subtext="Get ready to meet your language companion!" />;
  }

  const handleBotPress = async (bot: TChatBot) => {
    if (!pendingBotCreateResponse) {
      const foundExistingConvo = conversations?.find((c) => c.bot.id === bot.id);

      if (foundExistingConvo) {
        dispatch(startConversation({ bot, conversation: foundExistingConvo }));
        navigation.navigate('ChatScreen', { conversationId: foundExistingConvo.id });
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
      dispatch(startConversation({ bot, conversation: data }));
      navigation.navigate('ChatScreen', { conversationId: convoId });
    }
  };

  const renderBots = () => {
    return (
      <FlatList
        data={bots}
        renderItem={({ item }) => (
          <Pressable onPress={async () => { await handleBotPress(item); }} style={styles.profile}>
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
