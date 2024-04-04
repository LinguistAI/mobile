import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ChoiceItem from './ChoiceItem';

interface ChoiceListProps {
  items: string[];
  correctChoice: string;
  selectedChoice: string;
  handleChoice: (answer: string) => void;
  allowAnswer: boolean;
}

const ChoiceList = ({ items, correctChoice, selectedChoice, handleChoice, allowAnswer }: ChoiceListProps) => {
  const handleSelectChoice = (choice: string) => {
    handleChoice(choice);
  };

  const renderChoiceItems = () => {
    return items.map((i) => (
      <ChoiceItem
        key={i}
        choice={i}
        correctChoice={i === correctChoice}
        handleSelectChoice={handleSelectChoice}
        disable={!allowAnswer}
        status={selectedChoice === i ? 'selected' : 'default'}
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
