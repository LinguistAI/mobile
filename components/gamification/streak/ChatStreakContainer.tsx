import { ActivityIndicator, View } from 'react-native';
import ChatStreakButton from './ChatStreakButton';
import ChatStreakModal from './ChatStreakModal';
import { useState } from 'react';
import { useGetUserStreakQuery } from '../api';
import FetchError from '../../common/feedback/FetchError';

const ChatStreakContainer = () => {
  const [streakModalVisible, setModalVisible] = useState(false);

  const { data: streak, isFetching, isError } = useGetUserStreakQuery();

  if (isFetching) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <FetchError />;
  }

  if (!streak) {
    return <View />;
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
