import { View, StyleSheet } from 'react-native';
import WordLists from '../../components/word-bank/word-list/WordLists';
import WordListFilter from '../../components/word-bank/word-list/WordListFilter';

const WordListsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <WordListFilter />
      </View>
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
    marginTop: 30,
    gap: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 1,
  },
  wordListContainer: {
    flex: 8,
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
