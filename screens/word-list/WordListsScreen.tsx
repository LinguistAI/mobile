import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PrimaryTextInput from "../../components/common/input/PrimaryTextInput";
import ModalControlButtons from "../../components/common/modal/ModalControlButtons";
import ModalWrapper from "../../components/common/ModalWrapper";
import { useNavigation } from "@react-navigation/native";
import { WordList } from "./types";
import WordListFilter from "../../components/word-list/WordListFilter";
import MultilineTextInput from "../../components/common/input/MultilineTextInput";

const WORD_LISTS: WordList[] = [
  {
    id: "1",
    title: "My first list",
    description: "This is my first list",
    words: [
      {
        word: "hello",
        meanings: ["abc", "cdf"],
        examples: ["examples", "example2"],
      },
      {
        word: "world",
        meanings: ["abc", "cdf"],
        examples: ["examples", "example2"],
      },
    ],
    listStats: {
      mastered: 2,
      reviewing: 1,
      learning: 1,
    },
    imageUrl: "https://picsum.photos/200",
    pinned: false,
    isActive: false,
  },
  {
    id: "2",
    title: "My second list",
    description: "This is my second list",
    words: [
      {
        word: "hello",
        meanings: ["abc", "cdf"],
        examples: ["examples", "example2"],
      },
      {
        word: "world",
        meanings: ["abc", "cdf"],
        examples: ["examples", "example2"],
      },
    ],
    listStats: {
      mastered: 2,
      reviewing: 1,
      learning: 1,
    },
    imageUrl: "https://picsum.photos/250",
    pinned: false,
    isActive: false,
  },
  {
    id: "3",
    title: "My third list",
    description: "This is my third list",
    words: [
      {
        word: "hello",
        meanings: ["abc", "cdf"],
        examples: ["examples", "example2"],
      },
      {
        word: "world",
        meanings: ["abc", "cdf"],
        examples: ["examples", "example2"],
      },
    ],
    listStats: {
      mastered: 2,
      reviewing: 1,
      learning: 1,
    },
    imageUrl: "https://picsum.photos/300",
    pinned: false,
    isActive: false,
  },
];

const WordListsScreen = () => {
  const [wordLists, setWordLists] = useState(WORD_LISTS);
  const [filteredWordLists, setFilteredWordLists] = useState(wordLists);
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const [filter, setFilter] = useState({ title: "" });
  const navigation = useNavigation();
  const methods = useForm({
    defaultValues: {
      listName: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const filteredWordLists = wordLists.filter((list) =>
      list.title.toLowerCase().includes(filter.title.toLowerCase())
    );
    setFilteredWordLists(filteredWordLists);
  }, [filter]);

  const validateSubmit = (data: any) => {
    wordLists.forEach((list) => {
      if (list.title === data.listName) {
        methods.setError("listName", {
          type: "manual",
          message: "List name already exists",
        });
      }
    });
  };

  const onSubmit = (data: any) => {
    validateSubmit(data);

    if (!methods.formState.isValid) {
      return;
    }

    setWordLists([
      ...wordLists,
      {
        id: "4",
        title: data.listName,
        description: data.description,
        words: [],
        listStats: {
          mastered: 0,
          reviewing: 0,
          learning: 0,
        },
        pinned: false,
        isActive: false,
        imageUrl: "https://picsum.photos/260",
      },
    ]);
    setAddListModalVisible(false);
  };

  const onError = (errors: any, e: any) => {
    if (methods.formState.isValid) {
      console.log("No errors. This should not be called.");
      console.log(errors);
    }
  };

  const handleOpenAddListModal = () => {
    setAddListModalVisible(true);
  };

  const handleCancelAddList = () => {
    setAddListModalVisible(false);
    methods.clearErrors();
  };

  const handleListSelection = (listId: string) => {
    const selectedList = wordLists.find((list) => list.id === listId);
    navigation.navigate("WordListDetails", { list: selectedList });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <WordListFilter filter={filter} setFilter={setFilter} />
      </View>
      <View style={styles.wordListContainer}>
        {filteredWordLists.map((list) => (
          <Pressable
            style={styles.card}
            onPress={() => handleListSelection(list.id)}
          >
            <View key={list.id}>
              <Image source={{ uri: list.imageUrl }} style={styles.image} />
              <View style={styles.overlay}>
                <View>
                  <Text style={styles.title}>{list.title}</Text>
                  <Text style={styles.words}>
                    {list.words.length} words in total
                  </Text>
                </View>
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
              </View>
            </View>
          </Pressable>
        ))}
        <TouchableOpacity
          onPress={handleOpenAddListModal}
          style={styles.floatingAddListButton}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
        <ModalWrapper
          visible={addListModalVisible}
          onRequestClose={handleCancelAddList}
          title="Add a new list"
        >
          <FormProvider {...methods}>
            <View style={styles.formContent}>
              <PrimaryTextInput
                name="listName"
                label="List Name"
                defaultValue=""
                placeholder="Enter list name"
                rules={{ required: "List name is required", minLength: 3 }}
              />
              <PrimaryTextInput
                name="listDescription"
                label="List Description"
                defaultValue=""
                placeholder="Enter list description"
                rules={{ required: "List description is required" }}
              />
              <View style={styles.formControls}>
                <ModalControlButtons
                  onCancel={handleCancelAddList}
                  onSubmit={methods.handleSubmit(onSubmit, onError)}
                />
              </View>
            </View>
          </FormProvider>
        </ModalWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 40,
    gap: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    flex: 1,
  },
  wordListContainer: {
    flex: 11,
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
  formContent: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 20,
  },
  formControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 25,
  },
});

export default WordListsScreen;
