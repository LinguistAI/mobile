import { StyleSheet, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Colors from '../../theme/colors';

const LevelUpModal = () => {
  const isLevelUpModalVisible = false;

  const handleCancel = () => {
    // dispatch(setQuestReminderModalOpen(false));
  };

  return (
    <ReactNativeModal isVisible={isLevelUpModalVisible} onBackdropPress={handleCancel}>
      <View style={styles.container}></View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 16,
  },
});

export default LevelUpModal;
