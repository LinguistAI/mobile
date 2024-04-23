import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Colors from '../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../redux/chatSelectors';
import Divider from '../common/Divider';
import Title from '../common/Title';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { useGetAllConversationsQuery } from './api';
import { isDataResponse } from '../../services';
import { updateSelectedConversation } from '../../redux/chatSlice';

interface ActiveWordsModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const ActiveWordsModal = ({ visible, setVisible }: ActiveWordsModalProps) => {
  const { refetch } = useGetAllConversationsQuery();
  const dispatch = useDispatch();
  const conversation = useSelector(selectCurrentConversation);

  useEffect(() => {
    const updateConvo = async () => {
      const response = await refetch();
      const data = response.data;
      if (!isDataResponse(data)) return;
      const updatedConvo = data.find((d) => d.id === conversation?.id);
      console.log(updatedConvo);
      dispatch(updateSelectedConversation({ conversation: updatedConvo }));
    };
    updateConvo();
  }, [visible]);

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
