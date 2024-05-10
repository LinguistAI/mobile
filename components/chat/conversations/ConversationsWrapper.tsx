import { StyleSheet, View } from 'react-native';
import ConversationList from './ConversationList';
import FloatingButton from '../../common/FloatingButton';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import ConversationsHeader from './ConversationsHeader';

const ConversationsWrapper = () => {
  const navigation = useNavigation();

  const handleCreateNewConversation = () => {
    navigation.navigate('ChatBotsListScreen');
  };

  return (
    <View style={styles.root}>
      <ConversationsHeader />
      <ConversationList />
      <FloatingButton
        text="Chatbots"
        icon={<Ionicons name="chatbubble-ellipses" size={30} color={Colors.gray[100]} />}
        handlePress={handleCreateNewConversation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default ConversationsWrapper;
