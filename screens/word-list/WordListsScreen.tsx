import { View, StyleSheet } from 'react-native';
import WordList from '../../components/word-bank/word-list/WordList';

const WordListsScreen = () => {
  return (
    <View style={styles.container}>
      <WordList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 40,
    gap: 10,
  },
});

export default WordListsScreen;
