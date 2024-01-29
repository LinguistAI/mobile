import { StyleSheet, View } from "react-native";
import { TWordList } from "./types";
import Title from "../../components/common/Title";
import FloatingButton from "../../components/common/FloatingButton";

interface WordListDetailsScreenProps {
  route: any;
}

const WordListDetailsScreen = ({ route }: WordListDetailsScreenProps) => {
  const selectedList = route.params.list as TWordList;
  console.log(selectedList);
  return (
    <View style={styles.container}>
      <FloatingButton handlePress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WordListDetailsScreen;
