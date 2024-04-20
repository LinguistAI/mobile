import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';
import { ChoiceStatus } from './types';

interface ChoiceItemProps {
  choice: string;
  handleSelectChoice: (answer: string) => void;
  status: ChoiceStatus;
  correctChoice?: boolean;
  disable?: boolean;
}

const ChoiceItem = ({ choice, correctChoice, handleSelectChoice, disable, status }: ChoiceItemProps) => {
  const getChoiceContainerStyle = () => {
    const style = [];
    style.push(styles.questionContainer);
    if (status === 'selected') {
      if (correctChoice) {
        style.push(styles.correctChoiceContainer);
      } else {
        style.push(styles.wrongChoiceContainer);
      }
    }
    return style;
  };

  const getChoiceTextStyle = () => {
    const style = [];
    style.push(styles.choiceText);
    if (status === 'selected') {
      style.push(styles.selectedChoiceText);
    }
    return style;
  };

  const handleSelect = () => {
    if (disable) return;
    handleSelectChoice(choice);
  };

  return (
    <Pressable onPress={handleSelect}>
      <View style={getChoiceContainerStyle()}>
        <Text style={getChoiceTextStyle()}>{choice}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    borderRadius: 30,
    borderColor: Colors.gray[500],
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: Colors.gray[900],
    width: '80%',
    alignSelf: 'center',
  },
  correctChoiceContainer: {
    backgroundColor: Colors.green[500],
    color: Colors.gray[100],
  },
  wrongChoiceContainer: {
    backgroundColor: Colors.red[500],
    color: Colors.gray[100],
  },
  choiceText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedChoiceText: {
    color: Colors.gray[100],
  },
});

export default ChoiceItem;
