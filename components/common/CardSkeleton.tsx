import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface CardSkeletonProps {
  count: number;
  height?: number | string;
  width?: number | string;
}

const CardSkeleton = ({ count, height, width }: CardSkeletonProps) => {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerPlaceholder
          key={index}
          style={[styles.skeletonRectangle, height, width]}
          LinearGradient={LinearGradient}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  skeletonRectangle: {
    borderRadius: 10,
    width: '90%',
    height: 75,
    alignSelf: 'center',
  },
});

export default CardSkeleton;
