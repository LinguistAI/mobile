import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { TWordList } from "../../screens/word-list/types";
import ActionIcon from "../common/ActionIcon";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme/colors";

interface WordListProps {
  list: TWordList;
  handleListSelection: (id: string) => void;
}

const WordListCard = ({ list, handleListSelection }: WordListProps) => {
  return (
    <Pressable style={styles.card} onPress={() => handleListSelection(list.id)}>
      <View key={list.id}>
        <Image source={{ uri: list.imageUrl }} style={styles.image} />
        <View style={styles.overlay}>
          <View>
            <Text style={styles.title}>{list.title}</Text>
            <Text style={styles.words}>{list.words.length} words in total</Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.stats}>
              <Text style={styles.stat}>
                {list?.listStats.mastered} mastered{" "}
              </Text>
              <Text style={styles.stat}>
                {list?.listStats.reviewing} reviewing{" "}
              </Text>
              <Text style={styles.stat}>
                {list?.listStats.learning} learning
              </Text>
            </View>
            <View style={styles.menuContainer}>
              <ActionIcon
                icon={
                  <Ionicons
                    size={16}
                    name="ellipsis-vertical"
                    color={Colors.gray["900"]}
                  />
                }
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    width: "48%",
    position: "relative", // Add this line
  },
  words: {
    fontSize: 14,
    color: "#fff", // Add this line
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    position: "absolute", // Add this line
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Add this line
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.primary["500"], // Add this line
    opacity: 0.8, // Add this line
    marginTop: 25,
  },
  title: {
    paddingHorizontal: 10,
    paddingTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Add this line
    textAlign: "center",
  },
  stats: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "column",
  },
  stat: {
    fontSize: 13,
    color: "#fff", // Add this line
    fontStyle: "italic",
  },
  menuContainer: {
    alignSelf: "flex-end",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
});

export default WordListCard;
