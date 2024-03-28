import { StyleSheet, View } from 'react-native';
import BotProfile from './BotProfile';
import { TChatBot } from '../types';
import Colors from '../../../theme/colors';

interface BotProfileCardProps {
  bot: TChatBot;
}

const BotProfileCard = ({ bot }: BotProfileCardProps) => {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <BotProfile bot={bot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderColor: Colors.primary['500'],
    borderWidth: 1,
    padding: 10,
  },
});

export default BotProfileCard;
