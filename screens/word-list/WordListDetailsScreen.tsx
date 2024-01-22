import { View } from "react-native";

interface WordListDetailsScreenProps {
  route: any;
}

const WordListDetailsScreen = ({ route }: WordListDetailsScreenProps) => {
  const selectedList = route.params.list;
  return <View></View>;
};

export default WordListDetailsScreen;
