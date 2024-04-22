import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Colors from '../../theme/colors';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../redux/chatSelectors';
import Divider from '../common/Divider';
import Title from '../common/Title';

interface ActiveWordsModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const ActiveWordsModal = ({ visible, setVisible }: ActiveWordsModalProps) => {
  const conversation = useSelector(selectCurrentConversation);

  return (
    <ReactNativeModal isVisible={visible} onBackdropPress={() => setVisible(false)}>
      <View style={styles.modalContent}>
        <View>
          <Text style={styles.description}>
            We detected that you could use some help learning the words listed below.{' '}
            <Text style={{ fontWeight: 'bold' }}>{conversation?.bot.name || 'Our chatbot'}</Text> is using
            these words more frequently.
          </Text>
          <Divider style={{ width: '100%', borderColor: Colors.primary[500] }} />
          <ScrollView style={{}}>
            <View style={{ flex: 1, padding: 16, rowGap: 8 }}>
              {conversation?.unknownWords.map((w) => (
                <Text key={w.id} style={styles.word}>
                  {w.word}
                </Text>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 16,
  },
  container: {
    display: 'flex',
    gap: 16,
  },
  description: {
    color: Colors.gray[700],
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActiveWordsModal;
