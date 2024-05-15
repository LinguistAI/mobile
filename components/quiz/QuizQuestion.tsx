import { Dimensions, StyleSheet, View } from 'react-native';
import QuestionChoiceList from './QuestionChoiceList';
import QuizQuestionDisplay from './QuizQuestionDisplay';
import { Question } from './types';

interface QuestionProps {
  question: Question;
  selectedChoice: string;
  questionNo: number;
  totalNumberOfQuestions: number;
  handleChoice: (choice: string) => void;
  allowAnswer: boolean;
  correctAnswer?: string;
}

const QuizQuestion = ({
  question,
  handleChoice,
  questionNo,
  totalNumberOfQuestions,
  selectedChoice,
  allowAnswer,
  correctAnswer,
}: QuestionProps) => {
  const height = Dimensions.get('screen').height * 0.65;

  return (
    <View style={[styles.root, { height }]}>
      <View style={styles.questionDisplayContainer}>
        <QuizQuestionDisplay
          questionNo={questionNo}
          totalNumberOfQuestions={totalNumberOfQuestions}
          question={question.question}
        />
      </View>
      <View style={styles.choiceListContainer}>
        <QuestionChoiceList
          handleChoice={handleChoice}
          selectedChoice={selectedChoice}
          correctAnswer={correctAnswer}
          choices={question.options}
          allowAnswer={allowAnswer}
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
