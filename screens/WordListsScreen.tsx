import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const WORD_LISTS = [
  {
    id: "1",
    name: "My first list",
    words: ["hello", "world"],
    listStats: {
      mastered: 2,
      reviewing: 1,
      learning: 1,
    },
    imageUrl: "https://picsum.photos/200",
  },
  {
    id: "2",
    name: "My second list",
    words: ["hello", "world"],
    listStats: {
      mastered: 5,
      reviewing: 6,
      learning: 7,
    },
    imageUrl: "https://picsum.photos/150",
  },
  {
    id: "3",
    name: "My third list",
    words: ["hello", "world"],
    listStats: {
      mastered: 8,
      reviewing: 9,
      learning: 10,
    },
    imageUrl: "https://picsum.photos/250",
  },
];

const WordListsScreen = () => {
  const handleOpenAddListModal = () => {
    console.log("Open modal");
  };

  return (
    <View style={styles.container}>
      {WORD_LISTS.map((list) => (
        <View key={list.id} style={styles.card}>
          <Image source={{ uri: list.imageUrl }} style={styles.image} />
          <View style={styles.overlay}>
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.words}>
                {list.words.length} words in total
              </Text>
            </View>
            <View style={styles.stats}>
              <Text style={styles.stat}>
                {list.listStats.mastered} mastered{" "}
              </Text>
              <Text style={styles.stat}>
                {list.listStats.reviewing} reviewing{" "}
              </Text>
              <Text style={styles.stat}>
                {list.listStats.learning} learning
              </Text>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleOpenAddListModal}
        style={styles.floatingAddListButton}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    marginBottom: 10,
    width: "48%",
    position: "relative", // Add this line
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
  title: {
    paddingHorizontal: 10,
    paddingTop: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Add this line
    textAlign: "center",
  },
  words: {
    fontSize: 14,
    color: "#fff", // Add this line
    textAlign: "center",
  },
  stats: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.primary["500"], // Add this line
    opacity: 0.8, // Add this line
    flexDirection: "column",
    marginTop: 25,
  },
  stat: {
    fontSize: 13,
    color: "#fff", // Add this line
    fontStyle: "italic",
  },
  floatingAddListButton: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primary["600"],
    borderRadius: 30,
    elevation: 8,
  },
});

export default WordListsScreen;
