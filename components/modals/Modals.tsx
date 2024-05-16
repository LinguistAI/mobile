import { useSelector } from 'react-redux';
import DailyQuestReminderModal from './DailyQuestReminderModal';
import { selectIsLevelUpModalOpen, selectIsQuestReminderModalOpen } from '../../redux/chatSelectors';
import { View } from 'react-native';
import LevelUpModal from './LevelUpModal';

const Modals = () => {
  const isDailyQuestReminderModalVisible = useSelector(selectIsQuestReminderModalOpen);
  const isLevelUpModalVisible = useSelector(selectIsLevelUpModalOpen);

  return (
    <View>
      {isDailyQuestReminderModalVisible ? <DailyQuestReminderModal /> : null}
      {isLevelUpModalVisible ? <LevelUpModal /> : null}
    </View>
  );
};

export default Modals;
