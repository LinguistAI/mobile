import { StyleSheet, View } from 'react-native';
import Colors from '../../theme/colors';
import ActionIcon from '../common/ActionIcon';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './QuizProgressBar';

interface QuizHeaderProps {
  questionNo: number;
  totalQuestions: number;
}

const QuizHeader = ({ questionNo, totalQuestions }: QuizHeaderProps) => {
  const navigation = useNavigation();

  const handleClose = () => {
    navigation.goBack();
  };

  const progressRatio = questionNo / totalQuestions;

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <ActionIcon
          onPress={handleClose}
          icon={<Ionicons name="close" size={30} color={Colors.gray[500]} />}
        />
        <ProgressBar progress={progressRatio} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 60,
    borderBottomColor: Colors.primary[600],
    borderBottomWidth: 2,
    zIndex: 9999,
    backgroundColor: Colors.gray[0],
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
  },
});

export default QuizHeader;
