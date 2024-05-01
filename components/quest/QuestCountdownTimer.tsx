import {useEffect, useState} from "react";
import {DAYS_IN_MILLIS, HOURS_IN_MILLIS, MINUTES_IN_MILLIS, SECONDS_IN_MILLIS} from "./constants";
import {StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../theme/colors";

interface QuestCountdownTimerProps {
  assignedDate: string;
}

const QuestCountdownTimer = ({ assignedDate }: QuestCountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(assignedDate).getTime() + DAYS_IN_MILLIS;
      const distance = deadline - now.getTime();

      if (distance < 0) {
        setTimeLeft('Deadline passed');
        return;
      }

      const hours = Math.floor((distance % DAYS_IN_MILLIS) / HOURS_IN_MILLIS).toString();
      const minutes = Math.floor((distance % HOURS_IN_MILLIS) / MINUTES_IN_MILLIS).toString();
      const seconds = Math.floor((distance % MINUTES_IN_MILLIS) / SECONDS_IN_MILLIS).toString();

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [assignedDate]);

  return (
    <View style={styles.timerContainer}>
      <Ionicons style={styles.timerIcon} name="timer-outline" size={40} color="white" />
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    padding: 10,
    backgroundColor: Colors.primary[600],
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 24,
    color: Colors.gray[100],
    fontWeight: 'bold',
    textShadowColor: Colors.gray[800],
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    marginLeft: 6,
    marginRight: 5,
  },
  timerIcon: {
    textShadowColor: Colors.gray[800],
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  }
});

export default QuestCountdownTimer;
