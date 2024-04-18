import { useCallback, useEffect, useState } from 'react';
import QuizQuestion from './QuizQuestion';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../common/form/Button';
import QuizHeader from './QuizHeader';
import ChoiceFeedback from './ChoiceFeedback';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { getRandomPositiveFeedback } from './utils';
import { useNavigation } from '@react-navigation/native';
import { useDisableBottomTab } from '../../hooks/useDisableBottomTab';
import { QuizPhase, RCreateMCQ, TQuestion } from './types';
import { useCreateMCQMutation } from './quizApi';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../redux/chatSelectors';
import useNotifications from '../../hooks/useNotifications';
import { isDataResponse } from '../../services';
import AnimatedLottieView from 'lottie-react-native';
import Colors from '../../theme/colors';
import { generateErrorResponseMessage } from '../../utils/httpUtils';
import useError from '../../hooks/useError';

const QuizController = () => {
  useDisableBottomTab();
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [quiz, setQuiz] = useState<RCreateMCQ>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [phase, setPhase] = useState<QuizPhase>('waiting-answer');
  const [selectedChoice, setSelectedChoice] = useState('');
  const navigation = useNavigation();
  const conversationId = useSelector(selectCurrentConversation);
  const { add } = useNotifications();

  const [createMCQ, { error, reset }] = useCreateMCQMutation();

  const errorFallback = () => {
    navigation.goBack();
    reset();
  };
  useError(error, errorFallback);

  useEffect(() => {
    const createAndSetQuiz = async () => {
      if (!conversationId) {
        add({
          type: 'warning',
          body: 'Please start a conversation before attempting a quiz!',
        });
        navigation.navigate('Conversations');
        return;
      }
      try {
        const quiz = await createMCQ({ conversationId });
        if (isDataResponse(quiz)) {
          setQuiz(quiz.data);
          return;
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsQuizLoading(false);
      }
    };

    createAndSetQuiz();
  }, []);

  const questions = quiz?.questions;
  if (isQuizLoading) {
    return (
      <View style={styles.lottieRoot}>
        <AnimatedLottieView
          source={require('../../assets/lottie/quiz-loading.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
        <Text style={styles.preparationText}>Preparing your quiz...</Text>
      </View>
    );
  }

  if (!questions) {
    return null;
  }

  const getAnswerFeedback = () => {
    if (phase === 'end') return null;

    const curQ = questions[currentQuestion];
    if (selectedChoice === curQ.correctAnswer) {
      const feedback = getRandomPositiveFeedback();
      return (
        <View>
          <Text>{feedback}</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text>The correct answer was</Text>
          <Text style={styles.bold}> {curQ.correctAnswer}</Text>
          <Text>.</Text>
        </View>
      );
    }
  };

  const getFeedbackType = () => {
    if (phase === 'end') return 'info';

    const curQ = questions[currentQuestion];
    if (curQ.correctAnswer === selectedChoice) {
      return 'correct';
    }

    return 'incorrect';
  };

  const getFeedbackTitle = () => {
    if (phase === 'end') return 'Congrats!';

    return null;
  };

  const handleNextQuestion = () => {
    const newQuestionNumber = currentQuestion + 1;

    setPhase('waiting-answer');
    if (newQuestionNumber >= questions.length) {
      setPhase('end');
    } else {
      setCurrentQuestion(newQuestionNumber);
    }
    setSelectedChoice('');
  };

  const handleAnswer = (choice: string) => {
    setPhase('answered');
    setSelectedChoice(choice);
  };

  const handleFinish = () => {
    navigation.navigate('QuizResults');
  };

  const isAnswerCorrect = () => {
    if (phase === 'end') return false;

    const curQ = questions[currentQuestion];
    return curQ.correctAnswer === selectedChoice;
  };

  const renderNextQuestionButton = () => {
    const btnSchema = isAnswerCorrect() ? 'green' : 'red';

    if (phase === 'answered') {
      return (
        <Button type="outlined" color={btnSchema} onPress={handleNextQuestion}>
          CONTINUE
        </Button>
      );
    } else if (phase === 'end') {
      return (
        <Button type="outlined" color="grape" onPress={handleFinish}>
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

  const renderAnswerFeedback = () =>
    (phase === 'answered' || phase === 'end') && (
      <View style={styles.feedbackContainer}>
        <Animated.View entering={FadeInDown} exiting={FadeOutDown.duration(300)}>
          <ChoiceFeedback title={getFeedbackTitle()} type={getFeedbackType()}>
            {getAnswerFeedback()}
            <View style={styles.actionBtnContainer}>{renderNextQuestionButton()}</View>
          </ChoiceFeedback>
        </Animated.View>
      </View>
    );

  return (
    <View style={styles.root}>
      <QuizHeader questionNo={currentQuestion + 1} totalQuestions={questions.length} />
      {renderCurrentQuestion()}
      {renderAnswerFeedback()}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 30,
  },
  actionBtnContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 5,
  },
  feedbackContainer: {
    alignSelf: 'flex-end',
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
  lottieRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  preparationText: {
    color: Colors.primary[700],
    fontSize: 16,
  },
});

export default QuizController;
