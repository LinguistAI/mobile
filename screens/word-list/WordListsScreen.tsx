import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PrimaryTextInput from "../../components/common/input/PrimaryTextInput";
import ModalControlButtons from "../../components/common/modal/ModalControlButtons";
import ModalWrapper from "../../components/common/ModalWrapper";
import { useNavigation } from "@react-navigation/native";
import { TWordList } from "./types";
import WordListFilter from "../../components/word-list/WordListFilter";
import ActionIcon from "../../components/common/ActionIcon";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import WordListCard from "../../components/word-list/WordListCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WORD_LISTS: TWordList[] = [
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
  const [isLoading, setIsLoading] = useState(false);
  const [wordLists, setWordLists] = useState<TWordList[]>([]);
  const [filteredWordLists, setFilteredWordLists] = useState(wordLists);
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const navigation = useNavigation();
  const methods = useForm({
    defaultValues: {
      listName: "",
      listDescription: "",
    },
    mode: "onSubmit",
  });

  const getAndSetWordLists = async () => {
    const value = await AsyncStorage.getItem("wordLists");
    if (value) {
      setWordLists(JSON.parse(value) as TWordList[]);
    }
    setIsLoading(false);
  };

  const saveWordLists = async (wordLists: TWordList[]) => {
    try {
      const jsonValue = JSON.stringify(wordLists);
      await AsyncStorage.setItem("wordLists", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAndSetWordLists();
  }, []);

  useEffect(() => {
    saveWordLists(wordLists);
  }, [wordLists]);

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

  const onSubmit = async (data: any) => {
    validateSubmit(data);
    if (!methods.formState.isValid) {
      return;
    }
    const newWordList: TWordList = {
      id: uuidv4(),
      title: data.listName,
      description: data.listDescription,
      words: [],
      listStats: {
        mastered: 0,
        reviewing: 0,
        learning: 0,
      },
      pinned: false,
      isActive: false,
      imageUrl: "https://picsum.photos/270",
    };

    const updatedWordLists = [...wordLists, newWordList];
    setWordLists(updatedWordLists);
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
  };

  const handleListSelection = (listId: string) => {
    const selectedList = wordLists.find((list) => list.id === listId);
    navigation.navigate("WordListDetails", { list: selectedList });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary["600"]} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <WordListFilter
          wordLists={wordLists}
          setFilteredWordLists={setFilteredWordLists}
        />
      </View>
      <View style={{ flex: 8 }}>
        <FlatList
          data={filteredWordLists}
          renderItem={({ item }) => (
            <WordListCard
              key={item.id}
              list={item}
              handleListSelection={handleListSelection}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.wordListContainer}
        />
      </View>

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
                okText="Add"
              />
            </View>
          </View>
        </FormProvider>
      </ModalWrapper>
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
    padding: 10,
    flexDirection: "column",
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
    gap: 35,
  },
});

export default WordListsScreen;
