import { View } from 'react-native';
import QuestsList from "../../components/quest/QuestsList";
import { StyleSheet } from 'react-native';

const QuestsScreen = () => {
  return (
    <View style={styles.root}>
      <QuestsList />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default QuestsScreen;
