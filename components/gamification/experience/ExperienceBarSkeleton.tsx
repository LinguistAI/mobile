import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { BAR_HEIGHT, BAR_WIDTH } from './constants';

const ExperienceBarSkeleton = () => {
  return (
    <View>
      <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.levelText} />
      <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.bar} />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: 8,
    marginBottom: 10,
  },
  levelText: {
    width: BAR_WIDTH * 0.3,
    height: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default ExperienceBarSkeleton;
