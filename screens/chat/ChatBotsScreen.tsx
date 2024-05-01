import { SafeAreaView, StyleSheet } from 'react-native';
import BotLists from '../../components/chat/bots/BotLists';

const ChatBotsScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <BotLists />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default ChatBotsScreen;
