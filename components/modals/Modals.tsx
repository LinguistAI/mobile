import { useSelector } from 'react-redux';
import DailyQuestReminderModal from './DailyQuestReminderModal';
import { selectIsQuestReminderModalOpen } from '../../redux/chatSelectors';

const Modals = () => {
  const isDailyQuestReminderModalVisible = useSelector(selectIsQuestReminderModalOpen);
  return isDailyQuestReminderModalVisible && <DailyQuestReminderModal />;
};

export default Modals;
