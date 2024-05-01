import AnimatedLottieView from 'lottie-react-native';
import ActionButton from '../../common/ActionButton';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import React from 'react';
import LText from '../../common/Text';

interface ChatStreakButtonProps {
  currentStreak: number;
  handleOpenModal: () => void;
}

const ChatStreakButton = ({ currentStreak, handleOpenModal }: ChatStreakButtonProps) => {
  return (
    <ActionButton
      bgColor={Colors.primary[500]}
      icon={
        <AnimatedLottieView
          style={styles.lottie}
          autoPlay
          loop
          source={require('../../../assets/lottie/streak/streakFireAnim.json')}
        />
      }
      onPress={handleOpenModal}
      title={
        <View style={styles.lottieContainer}>
          <LText style={{ fontWeight: 'bold' }}>Streak: {currentStreak}</LText>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  lottieContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  lottie: {
    width: 25,
    height: 25,
  },
});

export default ChatStreakButton;
