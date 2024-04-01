import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const WordListsSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonSearchBar} />
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonListRectangle} />
          <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonListRectangle} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 8,
    paddingHorizontal: 20,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonListRectangle: {
    width: '48%',
    borderRadius: 4,
    height: 140,
  },
  skeletonSearchBar: {
    width: '85%',
    borderRadius: 4,
    height: 40,
  },
});

export default WordListsSkeleton;
