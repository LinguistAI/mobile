import AnimatedLottieView from 'lottie-react-native';
import ActionButton from '../../common/ActionButton';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import React from 'react';
import LText from '../../common/Text';

interface ChatStreakButtonProps {
  currentStreak: number | undefined;
  showTitle?: boolean;
}

const ChatStreakView = ({ currentStreak, showTitle = false }: ChatStreakButtonProps) => {
  return (
    <View style={styles.streakContainer}>
      <LText style={styles.textStyle}>Streak:</LText>
      <LText style={styles.textStyle}>{currentStreak}</LText>
      <AnimatedLottieView
        style={styles.lottie}
        autoPlay
        loop
        source={require('../../../assets/lottie/streak/streakFireAnim.json')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    margin: 0,
    padding: 0,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    margin: 0,
    padding: 0,
  },
  lottie: {
    width: 35,
    height: 35,
    margin: 0,
    marginBottom: 0,
    padding: 0,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 0,
    padding: 0,
    marginBottom: 0,
  },
});

export default ChatStreakView;
