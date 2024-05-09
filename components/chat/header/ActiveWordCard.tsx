import { Text } from 'react-native';
import Card from '../../common/Card';
import Colors from '../../../theme/colors';

interface ActiveWordCardProps {
  word: string;
}

const ActiveWordCard = ({ word }: ActiveWordCardProps) => {
  return (
    <Card noShadow style={{ zIndex: 1500, padding: 8, borderWidth: 1.5, borderColor: Colors.yellow[500] }}>
      <Text style={{ color: Colors.yellow[800], fontWeight: 'bold' }}>{word}</Text>
    </Card>
  );
};

export default ActiveWordCard;
