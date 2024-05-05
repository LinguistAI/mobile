import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Badge from '../../common/Badge';
import Colors from '../../../theme/colors';
import {
  getCurrentDayOfWeek,
  getDistanceBetweenTodayAndDay,
  getLastOneWeek,
} from '../../../utils/date.utils';

const StreakDisplay = ({
  currentStreak,
  highestStreak,
}: {
  currentStreak: number;
  highestStreak: number;
}) => {
  const lastWeek = getLastOneWeek();
  const currentDay = getCurrentDayOfWeek();
  const streakText =
    currentStreak === highestStreak
      ? 'You have just beaten your highest streak, keep going!'
      : `You have been chatting for ${currentStreak} days! `;
  const streakSubtext = `Your highest streak is ${highestStreak} days!`;
  if (currentStreak === 0) {
    return (
      <View>
        <Text>Start a chat to get your streak going!</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.lottieContainer}>
        <LottieView
          style={styles.lottie}
          autoPlay
          loop
          source={require('../../../assets/lottie/streak/streakFireAnim.json')}
        />
        <View style={styles.streakTextContainer}>
          <Text style={styles.streakText}>{streakText}</Text>
          <Text style={styles.streakSubtext}>{streakSubtext}</Text>
        </View>
        <View style={styles.streakDayBadgesContainer}>
          {lastWeek.map((day) => {
            let isStreakDay = false;
            const distance = getDistanceBetweenTodayAndDay(day);
            if (distance > currentStreak) {
              isStreakDay = false;
            } else if (distance >= 0) {
              isStreakDay = true;
            }

            const markedIcon = isStreakDay ? (
              <Ionicons name="chatbubbles" size={18} color="white" />
            ) : (
              <Ionicons name="chatbubbles" size={16} color={Colors.gray['500']} />
            );

            const backgroundColor = isStreakDay ? Colors.primary['500'] : Colors.gray['500'];

            return (
              <Badge
                key={day.id}
                label={day.short}
                backgroundColor={backgroundColor}
                textColor="#000"
                marked={isStreakDay}
                markedIcon={markedIcon}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

interface ChatStreakDisplayProps {
  currentStreak: number | undefined;
  highestStreak: number | undefined;
}

const ChatStreakDisplay = ({ currentStreak, highestStreak }: ChatStreakDisplayProps) => {
  return (
    <View style={styles.modalInnerContainer}>
      <StreakDisplay currentStreak={currentStreak || 0} highestStreak={highestStreak || 0} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalInnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  lottie: {
    width: 50,
    height: 50,
  },
  streakTextContainer: {
    maxWidth: 250,
    textAlign: 'center',
    rowGap: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  streakSubtext: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  streakDayBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '90%',
    marginTop: 20,
    gap: 5,
    paddingHorizontal: 15,
  },
});

export default ChatStreakDisplay;
