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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PrimaryTextInput from "../../components/common/input/PrimaryTextInput";
import ModalControlButtons from "../../components/common/modal/ModalControlButtons";
import ModalWrapper from "../../components/common/ModalWrapper";
import { useNavigation } from "@react-navigation/native";
import { WordList } from "./types";

const WORD_LISTS: WordList[] = [
  {
    id: "1",
    name: "My first list",
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
  },
  {
    id: "2",
    name: "My second list",
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
  },
  {
    id: "3",
    name: "My third list",
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
  },
];

const WordListsScreen = () => {
  const [wordLists, setWordLists] = useState(WORD_LISTS);
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const navigation = useNavigation();
  const methods = useForm({
    defaultValues: {
      listName: "",
    },
    mode: "onSubmit",
  });

  const validateSubmit = (data: any) => {
    wordLists.forEach((list) => {
      if (list.name === data.listName) {
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
        name: data.listName,
        words: [],
        listStats: {
          mastered: 0,
          reviewing: 0,
          learning: 0,
        },
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
      {wordLists.map((list) => (
        <Pressable onPress={() => handleListSelection(list.id)}>
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
        <View style={styles.formContent}>
          <FormProvider {...methods}>
            <PrimaryTextInput
              name="listName"
              label="List Name"
              defaultValue=""
              placeholder="Enter list name"
              rules={{ required: "List name is required" }}
            />
            <View style={styles.formControls}>
              <ModalControlButtons
                onCancel={handleCancelAddList}
                onSubmit={methods.handleSubmit(onSubmit, onError)}
              />
            </View>
          </FormProvider>
        </View>
      </ModalWrapper>
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
  modalContent: {
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    borderRadius: 20,
    width: "90%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    gap: 20,
  },
  formContent: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  formControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 25,
  },
});

export default WordListsScreen;
