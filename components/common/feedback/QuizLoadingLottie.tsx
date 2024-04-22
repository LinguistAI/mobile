import AnimatedLottieView from 'lottie-react-native';

interface QuizLoadingLottieProps {
  width: number;
  height: number;
}

const QuizLoadingLottie = ({ width, height }: QuizLoadingLottieProps) => {
  return (
    <AnimatedLottieView
      autoPlay
      loop
      source={require('../../../assets/lottie/quiz-loading.json')}
      style={{ width, height }}
    />
  );
};

export default QuizLoadingLottie;
