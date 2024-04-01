import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { TConversation } from '../types';
import { useDispatch } from 'react-redux';
import Colors from '../../../theme/colors';
import Avatar from '../../common/Avatar';
import { useNavigation } from '@react-navigation/native';
import { useGetAllConversationsQuery } from '../api';
import { startConversation } from '../../../redux/chatSlice';
import FetchError from '../../common/FetchError';
import LoadingIndicator from '../../common/LoadingIndicator';
import CenteredFeedback from '../../common/CenteredFeedback';

const ConversationList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: conversations, isFetching, isError } = useGetAllConversationsQuery();

  if (isFetching) return <LoadingIndicator subtext="Fetching your conversations..." />;
  if (isError) return <FetchError />;
  if (!conversations || conversations.length === 0)
    return <CenteredFeedback message="No conversations found. Click the add button to initiate a conversation." />;

  const handleConversationClick = (id: string) => {
    navigation.navigate('ChatScreen', { conversationId: id });
    dispatch(startConversation({ bot: conversations.find((c) => c.id === id)?.bot }));
  };

  const renderConversation = (item: TConversation) => {
    return (
      <Pressable onPress={() => handleConversationClick(item.id)}>
        <View style={styles.cardContainer}>
          <View style={styles.conversationRowContainer}>
            <Avatar src={item.bot.profileImage} width={40} height={40} />
            <View style={styles.conversationInfoContainer}>
              <Text style={styles.conversationTitle}>{item.title}</Text>
              <Text style={styles.conversationLastMessage}></Text>
            </View>
            <View></View>
          </View>
        </View>
      </Pressable>
    );
  };

  return <FlatList style={{ flex: 1 }} data={conversations} renderItem={({ item }) => renderConversation(item)} />;
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.gray[400],
    backgroundColor: Colors.gray[0],
  },
  conversationRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 15,
  },
  conversationInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  conversationTitle: {
    fontWeight: 'bold',
  },
  conversationLastMessage: {
    fontSize: 13,
    fontWeight: '300',
  },
  conversationTimestamp: {},
});

export default ConversationList;
