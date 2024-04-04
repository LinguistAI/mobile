import { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import { StyleSheet, View } from 'react-native';
import Button from '../common/form/Button';

type Phase = 'waiting-answer' | 'answered' | 'end';

const QuizController = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>('waiting-answer');
  const [selectedChoice, setSelectedChoice] = useState('');
  const questions: TQuestion[] = [
    {
      question: 'What is the capital of France?',
      answers: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
    },
    {
      question: 'What is the capital of Spain?',
      answers: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Madrid',
    },
    {
      question: 'What is the capital of Germany?',
      answers: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'Berlin',
    },
  ];

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setPhase('waiting-answer');
    setSelectedChoice('');
  };

  const handleAnswer = (choice: string) => {
    const newQuestionNumber = currentQuestion + 1;
    console.log(newQuestionNumber);
    if (newQuestionNumber >= questions.length - 1) {
      setPhase('end');
    } else {
      setPhase('answered');
    }
    setSelectedChoice(choice);
  };

  const handleFinish = () => {};

  const renderNextQuestionButton = () => {
    if (phase === 'answered') {
      return (
        <Button type="primary" onPress={handleNextQuestion}>
          NEXT QUESTION
        </Button>
      );
    } else if (phase === 'end') {
      return (
        <Button type="primary" onPress={handleFinish}>
          SEE RESULTS
        </Button>
      );
    } else {
      return null;
    }
  };

  const renderCurrentQuestion = () => {
    const question = questions[currentQuestion];
    return (
      <View>
        <QuizQuestion
          question={question}
          selectedChoice={selectedChoice}
          questionNo={currentQuestion + 1}
          totalNumberOfQuestions={questions.length}
          handleChoice={handleAnswer}
          allowAnswer={phase === 'waiting-answer'}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderCurrentQuestion()}
      <View style={styles.actionBtnContainer}>{renderNextQuestionButton()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 20,
  },
  actionBtnContainer: {
    width: '90%',
    alignSelf: 'center',
  },
});

export default QuizController;
