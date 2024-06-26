import { Platform, StyleSheet, Text, View } from 'react-native';
import { TConversation } from '../types';
import Avatar from '../../common/Avatar';
import Colors from '../../../theme/colors';

interface ConversationProps {
  data: TConversation;
}

const Conversation = ({ data }: ConversationProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.conversationRowContainer}>
        <Avatar src={data.bot.profileImage} width={40} height={40} />
        <View style={styles.conversationInfoContainer}>
          <Text style={styles.conversationTitle}>{data.title}</Text>
          <Text
            style={[
              {
                width: Platform.OS === 'ios' ? '80%' : undefined, // Only force width on iOS
              },
              styles.conversationLastMessage,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data.lastMessage}
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
