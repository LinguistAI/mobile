import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TChatBot } from '../types';
import BotProfile from './BotProfile';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useCreateNewConversationMutation, useGetAllConversationsQuery, useGetAvailableBotsQuery } from '../api';
import { startConversation } from '../../../redux/chatSlice';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import FetchFailErrorScreen from '../../../screens/common/FetchFailErrorScreen';

const BotLists = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    data: conversations,
    isFetching: isFetchingConversations,
    isError: conversationsNotLoaded,
  } = useGetAllConversationsQuery();
  const { data: bots, isFetching: isFetchingBots, isError: botsNotLoaded } = useGetAvailableBotsQuery();
  const [createConvo, { isLoading: pendingBotCreateResponse, data, error: createConversationError }] =
    useCreateNewConversationMutation();

  if (conversationsNotLoaded || botsNotLoaded) {
    return <FetchFailErrorScreen />;
  }

  if (isFetchingConversations || isFetchingBots) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleBotPress = async (bot: TChatBot) => {
    if (!pendingBotCreateResponse) {
      const foundExistingConvo = conversations?.find((c) => c.bot.id === bot.id);

      if (foundExistingConvo) {
        navigation.navigate('ChatScreen', { conversationId: foundExistingConvo.id });
      } else {
        await createConvo(bot.id);
        if (data) {
          const convoId = data.id;
          if (!convoId) {
            return;
          }
          navigation.navigate('ChatScreen', { conversationId: convoId });
        } else {
          generateErrorResponseMessage(createConversationError, 'Error creating conversation');
        }
      }
      dispatch(startConversation({ bot }));
    }
  };

  const renderBots = () => {
    return (
      <FlatList
        data={bots}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleBotPress(item)} style={styles.profile}>
            <BotProfile bot={item} />
          </Pressable>
        )}
        contentContainerStyle={styles.botListContainer}
        keyExtractor={(item) => item.id}
      />
    );
  };

  return <View style={styles.container}>{renderBots()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  profile: {
    marginHorizontal: 12,
  },
  botListContainer: {
    gap: 15,
  },
});

export default BotLists;
