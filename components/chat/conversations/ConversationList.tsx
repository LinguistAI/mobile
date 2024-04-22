import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LastMessageObject, TConversation } from '../types';
import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGetAllConversationsQuery } from '../api';
import { startConversation } from '../../../redux/chatSlice';
import FetchError from '../../common/feedback/FetchError';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import { useCallback, useState } from 'react';
import { getLastMessages } from '../utils';
import Conversation from './Conversation';

const ConversationList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: conversations, isFetching, isError } = useGetAllConversationsQuery();
  const [lastMessages, setLastMessages] = useState<LastMessageObject>({});

  useFocusEffect(
    useCallback(() => {
      const fetchLastMessages = async () => {
        const messages = await getLastMessages();
        setLastMessages(messages);
      };
      fetchLastMessages();
    }, [])
  );

  if (isFetching) return <LoadingIndicator subtext="Fetching your conversations..." />;
  if (isError) return <FetchError />;
  if (!conversations || conversations.length === 0)
    return (
      <CenteredFeedback message="No conversations found. Click the add button to initiate a conversation." />
    );

  const handleConversationClick = (id: string) => {
    navigation.navigate('ChatScreen', { conversationId: id });
    const conversation = conversations.find((c) => c.id === id);
    dispatch(startConversation({ bot: conversation?.bot || null, conversation: conversation }));
  };

  const renderConversation = (item: TConversation) => {
    const lastMessage = lastMessages[item.id] ?? { msg: '', timestamp: '' };
    return (
      <Pressable onPress={() => handleConversationClick(item.id)}>
        <Conversation data={item} lastMessage={lastMessage} />
      </Pressable>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={conversations}
      extraData={lastMessages}
      renderItem={({ item }) => renderConversation(item)}
    />
  );
};

export default ConversationList;
