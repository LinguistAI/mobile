import { useEffect, useRef, useState } from 'react';
import QuizQuestion from './QuizQuestion';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../common/form/Button';
import QuizHeader from './QuizHeader';
import QuestionChoiceFeedback from './QuestionChoiceFeedback';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { getRandomPositiveFeedback } from './utils';
import { useNavigation } from '@react-navigation/native';
import { useDisableBottomTab } from '../../hooks/useDisableBottomTab';
import { QuizPhase, RCheckMCQAnswer, RCreateMCQ } from './types';
import { useCheckAnswerMutation, useCreateMCQMutation, useFinishMCQMutation } from './quizApi';
import { useSelector } from 'react-redux';
import { selectCurrentConversation } from '../../redux/chatSelectors';
import useNotifications from '../../hooks/useNotifications';
import { isDataResponse } from '../../services';
import AnimatedLottieView from 'lottie-react-native';
import Colors from '../../theme/colors';
import useError from '../../hooks/useError';
import FetchError from '../common/feedback/FetchError';
import useCustomBackHandler from '../../hooks/useCustomBackHandler';

const QuizController = () => {
  useDisableBottomTab();
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

  const timer = useRef(Date.now());
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [quiz, setQuiz] = useState<RCreateMCQ>();
  const [questionCheck, setQuestionCheck] = useState<RCheckMCQAnswer>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [phase, setPhase] = useState<QuizPhase>('waiting-answer');
  const [selectedChoice, setSelectedChoice] = useState('');
  const navigation = useNavigation();
  const conversationId = useSelector(selectCurrentConversation)?.id;
  const { add } = useNotifications();

  const [createMCQ, { error }] = useCreateMCQMutation();
  const [checkAnswer, { error: checkError }] = useCheckAnswerMutation();
  const [finishMCQ, { error: finishError }] = useFinishMCQMutation();

  const finishMCQErrorFallback = () => {};
  const checkErrorFallback = () => {
    navigation.goBack();
  };
  const createErrorFallback = () => {
    navigation.goBack();
  };
  useError(finishError, finishMCQErrorFallback);
  useError(checkError, checkErrorFallback);
  useError(error, createErrorFallback);

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
      const quiz = await createMCQ({ conversationId });
      if (isDataResponse(quiz)) {
        setQuiz(quiz.data);
      }
      setIsQuizLoading(false);
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
        <Text style={styles.preparationText}>
          Just a moment, we're cooking up some challenging questions!
        </Text>
      </View>
    );
  }

  if (!questions) {
    return <FetchError />;
  }

  const getAnswerFeedback = () => {
    if (phase === 'end') return null;

    if (questionCheck?.isUserCorrect) {
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
          <Text style={styles.bold}> {questionCheck?.answer}</Text>
          <Text>.</Text>
        </View>
      );
    }
  };

  const getFeedbackType = () => {
    if (phase === 'end') return 'info';

    if (questionCheck?.isUserCorrect) {
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

  const handleAnswer = async (choice: string) => {
    setPhase('checking-answer');
    const question = questions[currentQuestion];
    const response = await checkAnswer({ answer: choice, questionId: question.id });
    if (isDataResponse(response)) {
      const data = response.data;
      setQuestionCheck(data);
    }
    setPhase('answered');
    setSelectedChoice(choice);
  };

  const handleFinish = async () => {
    setPhase('waiting-results');
    const response = await finishMCQ({ testId: quiz.id });
    if (isDataResponse(response)) {
      const data = response.data;
      const currentTime = Date.now();
      const timeElapsed = currentTime - timer.current;
      navigation.navigate('MCQResults', { results: data, timeElapsed });
    }
  };

  const isAnswerCorrect = () => {
    if (phase === 'end') return false;
    return questionCheck?.isUserCorrect;
  };

  const renderNextQuestionButton = () => {
    const btnSchema = isAnswerCorrect() ? 'green' : 'red';

    if (phase === 'answered' || phase === 'checking-answer') {
      return (
        <Button
          type="outlined"
          color={btnSchema}
          onPress={handleNextQuestion}
          loading={phase === 'checking-answer'}
        >
          CONTINUE
        </Button>
      );
    } else if (phase === 'end' || phase === 'waiting-results') {
      return (
        <Button type="outlined" color="grape" onPress={handleFinish} loading={phase === 'waiting-results'}>
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
          correctAnswer={questionCheck?.answer}
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
          <QuestionChoiceFeedback title={getFeedbackTitle()} type={getFeedbackType()}>
            {getAnswerFeedback()}
            <View style={styles.actionBtnContainer}>{renderNextQuestionButton()}</View>
          </QuestionChoiceFeedback>
        </Animated.View>
      </View>
    );

  return (
    <View>
      <QuizHeader questionNo={currentQuestion + 1} totalQuestions={questions.length} />
      {renderCurrentQuestion()}
      {renderAnswerFeedback()}
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign: 'center',
  },
});

export default QuizController;
