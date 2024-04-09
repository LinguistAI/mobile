import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

type FeedbackType = 'correct' | 'incorrect' | 'info';

interface ChoiceFeedbackProps {
  type: FeedbackType;
  children: React.ReactNode;
  title?: string | null;
}

const ChoiceFeedback = ({ type, title, children }: ChoiceFeedbackProps) => {
  const getTitle = () => {
    if (title) return title;

    if (type === 'correct') {
      return 'Correct!';
    } else if (type === 'info') {
      return 'Info!';
    } else if (type === 'incorrect') {
      return 'Wrong!';
    }

    return '';
  };

  const getBgStyles = () => {
    if (type === 'correct') {
      return styles.successBgColor;
    } else if (type === 'info') {
      return styles.infoBgColor;
    } else if (type === 'incorrect') {
      return styles.errorBgColor;
    }

    return styles.infoBgColor;
  };

  return (
    <View style={[styles.container, getBgStyles()]}>
      <View style={styles.notificationCard}>
        <Text style={styles.title}>{getTitle()}</Text>
        <View>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    borderRadius: 0,
    width: '100%',
  },
  notificationCard: {
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
  },
  successBgColor: {
    backgroundColor: Colors.green[0],
  },
  errorBgColor: {
    backgroundColor: Colors.red[200],
  },
  infoBgColor: {
    backgroundColor: Colors.grape[200],
  },
});

export default ChoiceFeedback;
