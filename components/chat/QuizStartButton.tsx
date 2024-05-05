import React from 'react';
import ShimmerButton from '../common/ShimmerButton';
import { useSelector } from 'react-redux';
import { selectCurrentBot } from '../../redux/chatSelectors';
import { useGetMessageCountByBotQuery } from './api';
import { useNavigation } from '@react-navigation/native';

const MIN_MESSAGE_COUNT = 1;
const MAX_MESSAGE_COUNT = 20;
const DAY_LIMIT = 1;

const QuizStartButton = () => {
  const currentBot = useSelector(selectCurrentBot);
  const {
    data: messageCount,
    isLoading,
    isError,
  } = useGetMessageCountByBotQuery({
    botId: currentBot?.id!,
    daysLimit: DAY_LIMIT,
    sort: 'asc',
  });
  const navigation = useNavigation();

  const countMessages = () => {
    let count = 0;
    if (!messageCount) return count;

    messageCount.forEach((c) => (count += c.messageCount));
    return count;
  };
  const msgCount = countMessages();

  const handleStartQuiz = () => {
    navigation.navigate('ChatMCQ');
  };

  if (isLoading || isError || msgCount < MIN_MESSAGE_COUNT) {
    return <ShimmerButton title="Start Quiz" disabled />;
  }

  const animated = msgCount >= MAX_MESSAGE_COUNT;
  return <ShimmerButton title="Start Quiz" animated={animated} onPress={handleStartQuiz} />;
};

export default QuizStartButton;
