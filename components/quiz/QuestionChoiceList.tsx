import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QuestionChoiceItem from './QuestionChoiceItem';
import { ChoiceStatus, QuestionOption } from './types';

interface QuestionChoiceListProps {
  choices: QuestionOption[];
  selectedChoice: string;
  handleChoice: (answer: string) => void;
  allowAnswer: boolean;
  correctAnswer?: string;
}

const QuestionChoiceList = ({
  choices: items,
  selectedChoice,
  handleChoice,
  allowAnswer,
  correctAnswer,
}: QuestionChoiceListProps) => {
  const handleSelectChoice = (choice: string) => {
    handleChoice(choice);
  };

  const getChoiceStatus = (choice: QuestionOption): ChoiceStatus => {
    if (selectedChoice === choice.label) {
      return 'selected';
    } else if (!allowAnswer) {
      return 'disabled';
    } else if (choice.isEliminated) {
      return 'eliminated';
    }

    return 'default';
  };

  const renderChoiceItems = () => {
    return items.map((i) => (
      <QuestionChoiceItem
        key={i.label}
        choice={i.label}
        handleSelectChoice={handleSelectChoice}
        disable={!allowAnswer}
        status={selectedChoice === i.label ? 'selected' : 'default'}
        correctChoice={correctAnswer === selectedChoice}
      />
    ));
  };

  return <View style={styles.listGrid}>{renderChoiceItems()}</View>;
};

const styles = StyleSheet.create({
  listGrid: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 12,
  },
});

export default QuestionChoiceList;
