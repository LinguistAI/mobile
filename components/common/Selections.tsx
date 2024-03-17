import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';
import Badge from './Badge';

type Item = {
  title: string;
  id: string;
};

interface SelectionsProps {
  items: Item[];
  color: string;
}

interface SelectionProps {
  item: Item;
  backgroundColor: string;
}

const Selection = ({ item, backgroundColor }: SelectionProps) => {
  return (
    <View style={[styles.selection, { backgroundColor }]}>
      <Text style={styles.text}>{item.title}</Text>
    </View>
  );
};

const Selections = ({ items, color }: SelectionsProps) => {
  return (
    <View style={styles.selections}>
      {items.map((item, index) => (
        <Selection item={item} backgroundColor={color} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
  },
  selection: {
    padding: 10,
    borderRadius: 10, // adjust as needed
    margin: 5,
  },
  text: {
    color: '#fff',
  },
});

export default Selections;
