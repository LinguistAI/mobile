import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Colors from '../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../redux/chatSelectors';
import Divider from '../common/Divider';
import { useEffect } from 'react';
import { useGetConversationQuery } from './api';
import { updateSelectedConversation } from '../../redux/chatSlice';
import LoadingIndicator from '../common/feedback/LoadingIndicator';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

interface ActiveWordsModalProps {
  visible: boolean;
  onBackdropPress: () => void;
}

const WalkThroughableView = walkthroughable(View);

const ActiveWordsModal = ({ visible, onBackdropPress }: ActiveWordsModalProps) => {
  const conversation = useSelector(selectCurrentConversation);
  const dispatch = useDispatch();
  const { data: latestConvoDetails, isLoading } = useGetConversationQuery(conversation?.id, {
    skip: !conversation,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (latestConvoDetails) {
      dispatch(updateSelectedConversation({ conversation: latestConvoDetails }));
    }
  }, [latestConvoDetails]);

  const renderDescription = () => {
    const unknownWords = latestConvoDetails?.unknownWords;
    if (!unknownWords || unknownWords.length === 0) {
      return <Text style={styles.description}>You need to chat more before seeing your active words!</Text>;
    } else {
      return (
        <Text style={styles.description}>
          We detected that you could use some help learning the words listed below.{' '}
          <Text style={{ fontWeight: 'bold' }}>{conversation?.bot.name || 'Our chatbot'}</Text> is using these
          words more frequently.
        </Text>
      );
    }
  };

  return (
    <ReactNativeModal isVisible={visible} onBackdropPress={onBackdropPress}>
      <View style={styles.modalContent}>
        {isLoading && <LoadingIndicator subtext="Finding your active words..." />}
        <View>
          {renderDescription()}
          <Divider style={{ width: '100%', borderColor: Colors.primary[500] }} />
          <ScrollView style={{}}>
            <View style={{ flex: 1, padding: 16, rowGap: 8 }}>
              {latestConvoDetails?.unknownWords.map((w) => (
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
    gap: 8,
  },
  description: {
    color: Colors.gray[700],
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.yellow[700],
  },
});

export default ActiveWordsModal;
