import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';

const Splash = () => {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>Linguist</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
});

export default Splash;
