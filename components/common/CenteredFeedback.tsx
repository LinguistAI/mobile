import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface CenteredFeedbackProps {
  message: string;
  icon?: React.ReactNode;
}

const CenteredFeedback = ({ message, icon }: CenteredFeedbackProps) => {
  return (
    <View style={styles.root}>
      {icon}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.gray[600],
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});

export default CenteredFeedback;
