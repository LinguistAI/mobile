import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { CollapsableContainer } from "../../../common/CollapsableContainer";
import { WordDefinition } from "../../../../screens/word-list/types";
import { useState } from "react";
import Colors from "../../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const WordAccordionItem = ({ item }: { item: WordDefinition }) => {
  const [expanded, setExpanded] = useState(false);

  const onItemPress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.wrap}>
      <TouchableWithoutFeedback onPress={onItemPress}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {expanded ? (
              <Ionicons name="chevron-down" size={24} color="white" />
            ) : (
              <Ionicons name="chevron-forward" size={24} color="white" />
            )}
            <Text style={styles.word}>{item.word}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <CollapsableContainer expanded={expanded}>
        <Text style={styles.collapsibleHeader}>Meanings</Text>
        {item.meanings.map((meaning, index) => (
          <Text key={`${index}-${meaning}`} style={styles.meaning}>
            {index + 1}
            {". "}
            {meaning}
          </Text>
        ))}
        <Text style={styles.collapsibleHeader}>
          {item.examples.length > 1 ? "Examples" : "Example"}
        </Text>
        {item.examples.length > 0 && (
          <View>
            {item.examples.map((example, index) => (
              <Text key={`${index}-${example}`} style={styles.example}>
                {index + 1} {". "}
                {example}
              </Text>
            ))}
          </View>
        )}
      </CollapsableContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.primary["400"],
    padding: 12,
    borderColor: Colors.primary["700"],
    borderWidth: 2,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  details: {
    marginTop: 10,
  },
  collapsibleHeader: {
    fontStyle: "italic",
    fontWeight: "bold",
    color: "white",
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontSize: 16,
  },
  meaning: {
    fontStyle: "italic",
  },
  example: {
    fontStyle: "italic",
  },
});

export default WordAccordionItem;
