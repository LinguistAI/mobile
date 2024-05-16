import { FlatList, Pressable } from 'react-native';
import { type TConversation } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGetAllConversationsQuery } from '../api';
import { startConversation } from '../../../redux/chatSlice';
import FetchError from '../../common/feedback/FetchError';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import Conversation from './Conversation';
import { useCallback } from 'react';
import { selectCurrentLanguage } from '../../../redux/chatSelectors';

const ConversationList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userLanguageCode = useSelector(selectCurrentLanguage);
  const { data: conversations, isLoading, isError, refetch } = useGetAllConversationsQuery(userLanguageCode);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) return <LoadingIndicator subtext="Fetching your conversations..." />;
  if (isError) return <FetchError />;
  if (!conversations || conversations.length === 0)
    return (
      <CenteredFeedback message="No conversations found. Click the add button to initiate a conversation." />
    );

  const handleConversationClick = (id: string) => {
    navigation.navigate('ChatScreen', { conversationId: id });
    const conversation = conversations.find((c) => c.id === id);
    dispatch(startConversation({ bot: conversation?.bot || null, conversation }));
  };

  const renderConversation = (item: TConversation) => {
    return (
      <Pressable onPress={() => { handleConversationClick(item.id); }}>
        <Conversation data={item} />
      </Pressable>
    );
  };

  return (
    <FlatList style={{ flex: 1 }} data={conversations} renderItem={({ item }) => renderConversation(item)} />
  );
};

export default ConversationList;
