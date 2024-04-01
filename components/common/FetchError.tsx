import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const FetchError = () => {
  return (
    <View style={styles.root}>
      <Ionicons name="alert-circle" size={24} color="red" />
      <Text>We have issues accessing our servers. Thanks for being patient with us!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export default FetchError;
