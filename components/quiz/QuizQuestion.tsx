import { Dimensions, StyleSheet, View } from 'react-native';
import ChoiceList from './ChoiceList';
import QuestionDisplay from './QuestionDisplay';

interface QuestionProps {
  question: TQuestion;
  selectedChoice: string;
  questionNo: number;
  totalNumberOfQuestions: number;
  handleChoice: (choice: string) => void;
  allowAnswer: boolean;
}

const QuizQuestion = ({
  question,
  handleChoice,
  questionNo,
  totalNumberOfQuestions,
  selectedChoice,
}: QuestionProps) => {
  const height = Dimensions.get('screen').height * 0.65;

  return (
    <View style={[styles.root, { height }]}>
      <View style={styles.questionDisplayContainer}>
        <QuestionDisplay
          questionNo={questionNo}
          totalNumberOfQuestions={totalNumberOfQuestions}
          question={question.question}
        />
      </View>
      <View style={styles.choiceListContainer}>
        <ChoiceList
          handleChoice={handleChoice}
          selectedChoice={selectedChoice}
          correctChoice={question.correctAnswer}
          items={question.answers}
          allowAnswer
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  questionDisplayContainer: {
    alignSelf: 'center',
    width: '70%',
  },
  choiceListContainer: {},
});

export default QuizQuestion;
