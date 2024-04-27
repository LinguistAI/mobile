import { View } from 'react-native';
import ChatStreakButton from './ChatStreakButton';
import ChatStreakModal from './ChatStreakModal';
import { useState } from 'react';
import { useGetUserStreakQuery } from '../api';
import FetchError from '../../common/feedback/FetchError';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';

const ChatStreakContainer = () => {
  const [streakModalVisible, setModalVisible] = useState(false);
  const { data: streak, isLoading, isError } = useGetUserStreakQuery();

  if (isLoading) {
    return <LoadingIndicator subtext="Wondering your streak? Hold on, we are calculating..." />;
  }

  if (isError || !streak) {
    return <FetchError withNavigation={false} />;
  }

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <ChatStreakButton currentStreak={streak.currentStreak} handleOpenModal={handleOpenModal} />
      <ChatStreakModal
        handleModalClose={handleCloseModal}
        handleModalOpen={handleOpenModal}
        streakModalVisible={streakModalVisible}
        streak={streak}
      />
    </View>
  );
};

export default ChatStreakContainer;
