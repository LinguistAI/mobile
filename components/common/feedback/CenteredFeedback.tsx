import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';

interface CenteredFeedbackProps {
  message: string;
  children?: React.ReactNode;
}

const CenteredFeedback = ({ message, children }: CenteredFeedbackProps) => {
  return (
    <View style={styles.root}>
      <Text style={styles.message}>{message}</Text>
      {children}
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
    fontSize: 18,
    color: Colors.gray[900],
    padding: 20,
    textAlign: 'center',
  },
});

export default CenteredFeedback;
