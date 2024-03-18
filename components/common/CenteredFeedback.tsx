import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface CenteredFeedbackProps {
  message: string;
}

const CenteredFeedback = ({ message }: CenteredFeedbackProps) => {
  return (
    <View style={styles.root}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    color: Colors.primary[500],
    padding: 20,
  },
});

export default CenteredFeedback;
