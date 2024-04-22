import { StyleSheet, Text, View } from 'react-native';
import { LastMessage, TConversation } from '../types';
import Avatar from '../../common/Avatar';
import Colors from '../../../theme/colors';

interface ConversationProps {
  data: TConversation;
  lastMessage: LastMessage;
}

const Conversation = ({ data, lastMessage }: ConversationProps) => {
  const { msg } = lastMessage;
  return (
    <View style={styles.cardContainer}>
      <View style={styles.conversationRowContainer}>
        <Avatar src={data.bot.profileImage} width={40} height={40} />
        <View style={styles.conversationInfoContainer}>
          <Text style={styles.conversationTitle}>{data.title}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.conversationLastMessage}>
            {msg}
          </Text>
        </View>
      </View>
    </View>
  );
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
    maxWidth: '98%',
  },
  conversationTimestamp: {
    alignSelf: 'flex-end',
    marginRight: 10,
    fontSize: 12,
    color: Colors.gray[500],
  },
});

export default Conversation;
