import { View, StyleSheet } from 'react-native';
import WordLists from '../../components/word-bank/word-list/WordLists';

const WordListsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wordListContainer}>
        <WordLists />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  wordListContainer: {
    flex: 1,
  },
  skeletonContainer: {
    flex: 8,
    paddingHorizontal: 20,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonRectangle: {
    width: '48%',
    borderRadius: 4,
    height: 140,
  },
});

export default WordListsScreen;
