import React, { useEffect, useState } from 'react';
import IonIcons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, Image } from 'react-native';
import Card from '../common/Card';
import Colors from '../../theme/colors';
import { RUserQuests } from "./types";
import QuestProgressBar from "./QuestProgressBar";
import Divider from "../common/Divider";
import {
  QUEST_TYPE_WORD,
  QUEST_TYPE_MESSAGE,
  QUEST_ICON_SIZE,
  DAYS_IN_MILLIS,
  SECONDS_IN_MILLIS,
  MINUTES_IN_MILLIS,
  HOURS_IN_MILLIS
} from './constants';

interface QuestCardProps {
  quest: RUserQuests;
  isLoading: boolean;
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const { title, description, reward, completionCriteria, type, progress, assignedDate } = quest;
  const [timeLeft, setTimeLeft] = useState('');

  const renderQuestImage = () => {
    switch (type) {
      case QUEST_TYPE_WORD:
        return <IonIcons name="book-outline" size={QUEST_ICON_SIZE} color="black" />;
      case QUEST_TYPE_MESSAGE:
        return <IonIcons name="chatbubble-ellipses-outline" size={QUEST_ICON_SIZE} color="black" />;
      default:
        return <IonIcons name="help-circle-outline" size={QUEST_ICON_SIZE} color="black" />;
    }
  };

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(assignedDate).getTime() + DAYS_IN_MILLIS;
      const distance = deadline - now.getTime();

      if (distance < 0) {
        setTimeLeft('Deadline passed');
        return;
      }

      const hours = Math.floor((distance % DAYS_IN_MILLIS) / HOURS_IN_MILLIS);
      const minutes = Math.floor((distance % HOURS_IN_MILLIS) / MINUTES_IN_MILLIS);
      const seconds = Math.floor((distance % MINUTES_IN_MILLIS) / SECONDS_IN_MILLIS);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    // Update the timer immediately and every second
    updateTimer();
    const intervalId = setInterval(updateTimer, SECONDS_IN_MILLIS);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [assignedDate]);

  return (
    <Card>
      <View style={styles.cardContainer}>
        <View style={styles.iconAndDetailsContainer}>
          <View>
            {renderQuestImage()}
          </View>

          <View style={styles.contentRoot}>
            <View style={styles.titleRoot}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.deadline}>{timeLeft}</Text>
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.detail}>Reward: {reward} points</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <QuestProgressBar
          style={styles.progressBar}
          goalTimes={completionCriteria.times}
          progressTimes={progress.times}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
  },
  iconAndDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  contentRoot: {
    flex: 1,
    marginLeft: 10,
  },
  titleRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.primary[500],
    marginBottom: 2,
  },
  deadline: {
    color: Colors.gray[500],
    fontSize: 14,
    alignSelf: 'center',
    paddingVertical: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.primary[500],
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    color: Colors.gray[800],
    marginBottom: 2,
  },
  detail: {
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 2,
  },
  divider: {
    marginVertical: 8,
  },
  progressBar: {
    textAlign: "center"
  },
});

export default QuestCard;
