import AnimatedLottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';
import QuizLoadingLottie from './QuizLoadingLottie';

interface LoadingLottieProps {
  lottie: React.ReactNode;
  text: string;
}

const LoadingLottie = ({ lottie, text }: LoadingLottieProps) => {
  return (
    <View style={styles.root}>
      {lottie}
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default LoadingLottie;
