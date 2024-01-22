import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import Badge from "../common/Badge";
import { getUserChatStreak } from "../../services/UserStreak.service";
import Colors from "../../theme/colors";
import {
  DaysOfWeek,
  getCurrentDayOfWeek,
  getDistanceBetweenTodayAndDay,
  getLastOneWeek,
} from "../../utils/date.utils";

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
      ? "You have just beaten your highest streak, keep going!"
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
          source={require("../../assets/lottie/streak/streakFireAnim.json")}
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
            } else if (distance > 0) {
              isStreakDay = true;
            }

            const markedIcon = isStreakDay ? (
              <Ionicons name="chatbubbles" size={20} color="white" />
            ) : (
              <Ionicons
                name="chatbubbles"
                size={14}
                color={Colors.gray["500"]}
              />
            );

            const backgroundColor = isStreakDay
              ? Colors.primary["500"]
              : Colors.gray["500"];

            return (
              <Badge
                key={day.id}
                label={day.letter}
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

interface ChatStreakContainerProps {
  isLoading: boolean;
  currentStreak: number | undefined;
  highestStreak: number | undefined;
}

const ChatStreakContainer = ({
  isLoading,
  currentStreak,
  highestStreak,
}: ChatStreakContainerProps) => {
  return (
    <View style={styles.modalInnerContainer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <StreakDisplay
          currentStreak={currentStreak || 0}
          highestStreak={highestStreak || 0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalInnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  lottie: {
    width: 50,
    height: 50,
  },
  streakTextContainer: {
    maxWidth: 250,
    textAlign: "center",
    rowGap: 10,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  streakSubtext: {
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "center",
  },
  streakDayBadgesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 5,
  },
});

export default ChatStreakContainer;
