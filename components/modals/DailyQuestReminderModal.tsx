import ReactNativeModal from 'react-native-modal';
import ModalControlButtons from '../common/modal/ModalControlButtons';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsQuestReminderModalOpen } from '../../redux/chatSelectors';
import { setQuestReminderModalOpen } from '../../redux/chatSlice';
import { useNavigation } from '@react-navigation/native';
import useUser from '../../hooks/useUser';
import Colors from '../../theme/colors';
import Divider from '../common/Divider';
import { Ionicons } from '@expo/vector-icons';

const DailyQuestReminderModal = () => {
  const navigation = useNavigation();
  const isDailyQuestReminderModalVisible = useSelector(selectIsQuestReminderModalOpen);
  const dispatch = useDispatch();
  const user = useUser();

  const handleCancel = () => {
    dispatch(setQuestReminderModalOpen(false));
  };

  const handleConfirm = () => {
    dispatch(setQuestReminderModalOpen(false));
    if (user) {
      navigation.navigate('HomeTab');
    }
  };

  return (
    <ReactNativeModal isVisible={isDailyQuestReminderModalVisible} onBackdropPress={handleCancel}>
      <View style={styles.container}>
        <View style={{ gap: 16 }}>
          <Ionicons style={{ alignSelf: 'center' }} name="gift" size={48} color={Colors.primary[600]} />
          <Text style={styles.reminderText}>Hey there! Don't forget to complete your daily quest!</Text>
        </View>
        <Divider />
        <View style={{ display: 'flex', flexDirection: 'row', gap: 24, alignSelf: 'flex-end' }}>
          <ModalControlButtons
            onCancel={handleCancel}
            onSubmit={handleConfirm}
            okText="Take me there!"
            cancelText="No, thanks."
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 16,
  },
  reminderText: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default DailyQuestReminderModal;
