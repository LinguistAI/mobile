import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RFinishMCQ, ResultQuestion } from './types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Card from '../common/Card';
import Colors from '../../theme/colors';
import { msToSeconds } from '../../utils';
import { Ionicons } from '@expo/vector-icons';
import Title from '../common/Title';
import Button from '../common/form/Button';
import useCustomBackHandler from '../../hooks/useCustomBackHandler';

interface ChatScreenProps {
  route: RouteProp<{
    MCQResults: {
      timeElapsed: number; // in ms
      results: RFinishMCQ;
    };
  }>;
}

const QuizResults = ({ route }: ChatScreenProps) => {
  const navigation = useNavigation();
  useCustomBackHandler(() => {
    Alert.alert('Hold on!', "Are you sure you want to quit the quiz? You won't be able to come back to it!", [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => navigation.navigate('Conversations') },
    ]);
    return true;
  });

  const results = route.params.results;
  const timeElapsed = route.params.timeElapsed;
  const timeElapsedSeconds = msToSeconds(timeElapsed, true);

  const getQuestionFeedbackCardStyle = (q: ResultQuestion) => {
    const cardStyle = [];
    cardStyle.push(styles.feedbackCard);

    if (q.isUserCorrect) {
      cardStyle.push(styles.correctAnswerCard);
    } else {
      cardStyle.push(styles.incorrectAnswerCard);
    }

    return cardStyle;
  };

  const renderQuestionAnswersFeedbackContent = (q: ResultQuestion) => {
    if (q.isUserCorrect) {
      return (
        <>
          <Text style={styles.correctFeedbackText}>Correct!</Text>
          <Text style={styles.correctQuestionText}>{q.question}</Text>
          <Text style={styles.correctFeedbackAnswerText}>
            Your answer was: <Text style={styles.answer}>{q.userAnswer}</Text>
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.incorrectFeedbackText}>Incorrect!</Text>
          <Text style={styles.incorrectQuestionText}>{q.question}</Text>
          <Text style={styles.incorrectFeedbackAnswerText}>
            Your answer was: <Text style={styles.answer}>{q.userAnswer}</Text>
          </Text>
          <Text style={styles.incorrectFeedbackAnswerText}>
            Correct answer was: <Text style={styles.answer}>{q.answer}</Text>
          </Text>
        </>
      );
    }
  };

  const renderQuizAnswersFeedback = () => {
    return (
      <View>
        <Title size="h3">Quiz summary</Title>
        <View style={{ gap: 8, alignItems: 'center' }}>
          {results.questions.map((q) => (
            <Card key={q.id} style={getQuestionFeedbackCardStyle(q)}>
              <View style={styles.feedbackContentContainer}>{renderQuestionAnswersFeedbackContent(q)}</View>
            </Card>
          ))}
        </View>
      </View>
    );
  };

  const renderResultStats = () => {
    return (
      <View>
        <Title size="h3">Stats</Title>
        <View style={styles.statContainer}>
          <View style={{ alignItems: 'center' }}>
            <Card style={styles.statCard}>
              <Ionicons name="stats-chart" size={24} color={Colors.primary[500]} />
              <Text style={styles.statValue}>{results.correctPercentage}%</Text>
            </Card>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Card style={styles.statCard}>
              <Ionicons name="time-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.statValue}>{timeElapsedSeconds} seconds</Text>
            </Card>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, marginVertical: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        <View>{renderResultStats()}</View>
        {renderQuizAnswersFeedback()}
        <View style={{ margin: 16 }}>
          <Button type="primary" onPress={() => navigation.navigate('Conversations')}>
            RETURN TO CHAT
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  feedbackCard: {
    padding: 16,
    borderRadius: 16,
    width: '90%',
  },
  correctAnswerCard: {
    borderColor: Colors.green[600],
    borderWidth: 2,
  },
  correctQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctFeedbackText: {
    color: Colors.green[500],
    fontWeight: 'bold',
    fontSize: 16,
  },
  correctFeedbackAnswerText: {
    color: Colors.green[400],
    fontSize: 14,
  },
  answer: {
    fontWeight: 'bold',
  },
  incorrectAnswerCard: {
    borderColor: Colors.red[600],
    borderWidth: 2,
  },
  incorrectQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incorrectFeedbackText: {
    color: Colors.red[500],
    fontWeight: 'bold',
    fontSize: 16,
  },
  incorrectFeedbackAnswerText: {
    color: Colors.red[400],
    fontSize: 14,
  },
  feedbackContentContainer: {
    display: 'flex',
    gap: 8,
  },
  statContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  statCard: {
    borderColor: Colors.primary[600],
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
  },
});

export default QuizResults;
