import { StyleSheet, Text } from 'react-native';
import Card from '../../common/Card';
import Colors from '../../../theme/colors';

interface ActiveWordCardProps {
  word: string;
}

const ActiveWordCard = ({ word }: ActiveWordCardProps) => {
  return (
    <Card noShadow style={styles.card}>
      <Text style={styles.word}>{word}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    zIndex: 1500,
    padding: 8,
    borderWidth: 1.5,
    borderColor: Colors.yellow[500],
  },
  word: {
    color: Colors.yellow[800],
    fontWeight: 'bold',
  },
});

export default ActiveWordCard;
