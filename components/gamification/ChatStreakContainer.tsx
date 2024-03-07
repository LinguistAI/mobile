import { View } from 'react-native';
import ChatStreakButton from './ChatStreakButton';
import ChatStreakModal from './ChatStreakModal';
import { useState } from 'react';
import { useGetUserStreakQuery } from './gamificationApi';

const ChatStreakContainer = () => {
  const [streakModalVisible, setModalVisible] = useState(false);

  const { data: streak, isFetching, isError } = useGetUserStreakQuery();

  if (isFetching) {
    return <View />;
  }

  if (isError) {
    return <View />;
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
