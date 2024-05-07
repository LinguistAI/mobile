import { StyleSheet, View } from 'react-native';
import StoreItemsList from './StoreItemsList';
import StoreHeader from './StoreHeader';

const StoreWrapper = () => {

  return (
    <View style={styles.root}>
      <StoreHeader />
      <StoreItemsList />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default StoreWrapper;
