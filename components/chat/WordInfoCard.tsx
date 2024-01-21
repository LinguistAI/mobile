import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionIcon from "../common/ActionIcon";
import CloseIcon from "../common/CloseIcon";
import Colors from "../../theme/colors";

interface WordInfoCardProps {
  selectedWord: string;
  meanings: string[];
  exampleSentences: string[];
  onDismiss: () => void;
}

const WordInfoCard = ({
  selectedWord,
  meanings,
  exampleSentences,
  onDismiss,
}: WordInfoCardProps) => {
  // TODO: Make the wordlists global using Jotai, also save the latest
  // selected wordlist, and use it as the default value
  const [selectedWordList, setSelectedWordList] = useState<number>(1);

  // TODO: Fetch the wordlists from the server
  const wordLists = [
    {
      name: "Nouns",
      id: 1,
    },
    {
      name: "Verbs",
      id: 2,
    },
    {
      name: "Adjectives",
      id: 3,
    },
    {
      name: "Adverbs",
      id: 4,
    },
  ];

  return (
    <View style={styles.cardContainer}>
      <CloseIcon onPress={onDismiss} />
      <View style={styles.explanationContainer}>
        <Text style={styles.word}>{selectedWord}</Text>
        {meanings.map((meaning, index) => (
          <Text key={index} style={styles.meaning}>
            {meaning}
          </Text>
        ))}
        {exampleSentences.map((sentence, index) => (
          <Text key={index} style={styles.example}>
            {sentence}
          </Text>
        ))}
      </View>
      <View style={styles.actionsContainer}>
        <View style={styles.picker}>
          <Picker
            itemStyle={styles.pickerItem}
            selectedValue={selectedWordList}
            onValueChange={(itemValue) => setSelectedWordList(itemValue)}
            mode="dropdown"
          >
            {wordLists.map((wordList) => (
              <Picker.Item
                key={wordList.id}
                label={wordList.name}
                value={wordList.id}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.addIconContainer}>
          <ActionIcon
            icon={
              <Ionicons
                name="add-circle"
                size={36}
                color={Colors.primary[600]}
              />
            }
            // TODO: Add the word to the selected wordlist
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  explanationContainer: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  meaning: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  example: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    columnGap: 15,
  },
  pickerItem: {
    height: 60,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  picker: {
    flex: 5,
    height: 60,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.gray[700],
    borderRadius: 4,
    marginBottom: 20,
    textAlign: "center",
  },
  addIconContainer: {
    flex: 1,
    alignSelf: "center",
  },
});

export default WordInfoCard;
