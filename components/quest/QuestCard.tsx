import IonIcons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import Card from '../common/Card';
import Colors from '../../theme/colors';
import { RUserQuests } from './types';
import QuestProgressBar from './QuestProgressBar';
import Divider from '../common/Divider';
import { QUEST_TYPE_WORD, QUEST_TYPE_MESSAGE, QUEST_ICON_SIZE } from './constants';

interface QuestCardProps {
  quest: RUserQuests;
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const { title, description, reward, completionCriteria, type, progress } = quest;

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

  return (
    <Card>
      <View style={styles.cardContainer}>
        <View style={styles.iconAndDetailsContainer}>
          <View>{renderQuestImage()}</View>
          <View style={styles.contentRoot}>
            <View style={styles.titleRoot}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.detail}>Reward: {reward} points</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <QuestProgressBar goalTimes={completionCriteria.times} progressTimes={progress.times} />
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
    textAlign: 'center',
  },
});

export default QuestCard;
