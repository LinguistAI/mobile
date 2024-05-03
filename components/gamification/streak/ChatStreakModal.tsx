import { Modal, StyleSheet, View } from 'react-native';
import CloseIcon from '../../common/CloseIcon';
import useUser from '../../../hooks/useUser';
import { useEffect } from 'react';
import { isDateToday } from '../../../utils/date.utils';
import ChatStreakDisplay from './ChatStreakDisplay';
import { IUserStreak } from '../types';

interface ChatStreakModalProps {
  streakModalVisible: boolean;
  streak: IUserStreak;
  handleModalClose: () => void;
  handleModalOpen: () => void;
}

const ChatStreakModal = ({
  handleModalClose,
  handleModalOpen,
  streakModalVisible,
  streak,
}: ChatStreakModalProps) => {
  const { user } = useUser();

  useEffect(() => {
    if (user && user.lastLogin && isDateToday(user.lastLogin)) {
      handleModalClose();
    } else {
      handleModalOpen();
    }
  }, [user]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={streakModalVisible}
      onRequestClose={handleModalClose}
      style={{ alignSelf: 'center' }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CloseIcon onPress={handleModalClose} />
          <ChatStreakDisplay currentStreak={streak.currentStreak} highestStreak={streak.highestStreak} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    minHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default ChatStreakModal;
