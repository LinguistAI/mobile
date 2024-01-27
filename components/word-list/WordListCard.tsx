import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { TWordList } from "../../screens/word-list/types";
import ActionIcon from "../common/ActionIcon";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme/colors";
import { useState } from "react";
import WordListCardOptionMenu from "./WordListCardOptionMenu";
import { TMenuOption } from "./types";

interface WordListProps {
  list: TWordList;
  handleListSelection: (id: string) => void;
}

const WordListCard = ({ list, handleListSelection }: WordListProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const triggerOption = (option: TMenuOption) => {
    switch (option) {
      case TMenuOption.EDIT:
        console.log("EDIT");
        break;
      case TMenuOption.FAVORITE:
        console.log("FAVORITE");
        break;
      case TMenuOption.DELETE:
        console.log("DELETE");
        break;
      case TMenuOption.PIN:
        console.log("PIN");
        break;
      case TMenuOption.CANCEL:
        console.log("CANCEL");
        break;
    }
  };

  const renderPin = () => {
    if (list.pinned) {
      return (
        <View style={styles.pin}>
          <ActionIcon
            icon={<Ionicons size={24} name="pin" color={Colors.gray["900"]} />}
            onPress={() => triggerOption(TMenuOption.PIN)}
          />
        </View>
      );
    }
  };

  const renderFavourite = () => {
    if (list.favorite) {
      return (
        <View style={styles.favourite}>
          <ActionIcon
            icon={
              <Ionicons
                size={24}
                name="heart-circle-outline"
                color={Colors.gray["100"]}
              />
            }
            onPress={() => triggerOption(TMenuOption.FAVORITE)}
          />
        </View>
      );
    }
  };

  return (
    <Pressable
      style={styles.card}
      onLongPress={() => setMenuVisible(true)}
      onPress={() => handleListSelection(list.id)}
    >
      <View key={list.id}>
        <Image source={{ uri: list.imageUrl }} style={styles.image} />
        <View style={styles.overlay}>
          {renderPin()}
          {renderFavourite()}
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
              <WordListCardOptionMenu
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                triggerOption={triggerOption}
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
    marginRight: 8,
  },
  pin: {
    position: "absolute", // Add this line
    top: 0,
    left: 0,
    zIndex: 1,
  },
  favourite: {
    position: "absolute", // Add this line
    top: 0,
    right: 0,
    zIndex: 1,
  },
  words: {
    fontSize: 14,
    color: "#fff", // Add this line
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
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
