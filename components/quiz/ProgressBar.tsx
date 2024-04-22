import * as Progress from 'react-native-progress';
import Colors from '../../theme/colors';

interface ProgressBar {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBar) => {
  return (
    <Progress.Bar
      progress={progress}
      borderRadius={8}
      color={Colors.green[500]}
      unfilledColor={Colors.gray[100]}
      borderWidth={1}
      borderColor={Colors.green[700]}
      height={'50%'}
    />
  );
};

export default ProgressBar;
