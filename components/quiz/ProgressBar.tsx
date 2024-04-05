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
      color={Colors.green[600]}
      unfilledColor={Colors.green[0]}
      borderWidth={1}
      height={'50%'}
    />
  );
};

export default ProgressBar;
