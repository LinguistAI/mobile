import { View, StyleSheet } from 'react-native';
import StoreWrapper from '../../components/gamification/store/StoreWrapper';

const StoreScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <StoreWrapper />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  itemsContainer: {
    flex: 1,
  },
  skeletonContainer: {
    flex: 8,
    paddingHorizontal: 20,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonRectangle: {
    width: '48%',
    borderRadius: 4,
    height: 140,
  },
});

export default StoreScreen;
