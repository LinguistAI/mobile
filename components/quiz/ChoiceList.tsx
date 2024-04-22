import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ChoiceItem from './ChoiceItem';

interface ChoiceListProps {
  items: string[];
  selectedChoice: string;
  handleChoice: (answer: string) => void;
  allowAnswer: boolean;
  correctAnswer?: string;
}

const ChoiceList = ({ items, selectedChoice, handleChoice, allowAnswer, correctAnswer }: ChoiceListProps) => {
  const handleSelectChoice = (choice: string) => {
    handleChoice(choice);
  };

  const renderChoiceItems = () => {
    return items.map((i) => (
      <ChoiceItem
        key={i}
        choice={i}
        handleSelectChoice={handleSelectChoice}
        disable={!allowAnswer}
        status={selectedChoice === i ? 'selected' : 'default'}
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

export default ChoiceList;
