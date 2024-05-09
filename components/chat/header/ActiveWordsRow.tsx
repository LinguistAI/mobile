import { StyleSheet, Text, View } from 'react-native';
import useLatestConversationDetails from '../../../hooks/useLatestConversationDetails';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../../redux/chatSelectors';
import ActiveWordCard from './ActiveWordCard';

const ActiveWordsRow = () => {
  const conversation = useSelector(selectCurrentConversation);
  const { latestConvoDetails } = useLatestConversationDetails(conversation);

  return (
    <View style={styles.cardContainer}>
      {latestConvoDetails?.unknownWords.map((w) => <ActiveWordCard word={w.word} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ActiveWordsRow;
