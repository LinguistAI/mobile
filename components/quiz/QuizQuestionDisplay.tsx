import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface QuestionDisplayProps {
  questionNo: number;
  totalNumberOfQuestions: number;
  question: string;
}

const QuizQuestionDisplay = ({ question, questionNo, totalNumberOfQuestions }: QuestionDisplayProps) => {
  return (
    <View>
      <View style={styles.questionCard}>
        <View style={styles.cardContentRoot}>
          <Text style={styles.questionNumberText}>
            Question {questionNo}/{totalNumberOfQuestions}
          </Text>
          <Text style={styles.questionText}>{question}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    borderWidth: 1,
    borderColor: Colors.primary[500],
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  cardContentRoot: {
    minHeight: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  questionNumberText: {
    fontSize: 14,
    color: Colors.primary[400],
    textAlign: 'center',
  },
});

export default QuizQuestionDisplay;
