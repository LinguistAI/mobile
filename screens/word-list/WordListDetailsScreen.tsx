import { FlatList, StyleSheet, View } from "react-native";
import { TWordList } from "./types";
import FloatingButton from "../../components/common/FloatingButton";
import WordCardAccordion from "../../components/word-bank/word-list/details/WordAccordionItem";

interface WordListDetailsScreenProps {
  route: any;
}

const wordList: TWordList = {
  description: "abc",
  favorite: false,
  id: "8bcdca10-0da4-4843-9d8a-d10a0151499c",
  imageUrl: "https://picsum.photos/270",
  isActive: true,
  listStats: { learning: 0, mastered: 0, reviewing: 0 },
  pinned: false,
  title: "Lisye",
  words: [
    {
      examples: ["abc"],
      meanings: ["this is an example"],
      word: "Word",
    },
    {
      examples: ["abc"],
      meanings: ["this is an example"],
      word: "Word",
    },
    {
      examples: ["abc"],
      meanings: ["this is an example"],
      word: "Word",
    },
  ],
};

const WordListDetailsScreen = ({ route }: WordListDetailsScreenProps) => {
  const selectedList = route.params.list as TWordList;

  console.log(selectedList);
  return (
    <View style={styles.container}>
      <FlatList
        data={wordList.words}
        renderItem={({ item }) => <WordCardAccordion item={item} />}
        contentContainerStyle={{
          justifyContent: "center",
        }}
      />
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
