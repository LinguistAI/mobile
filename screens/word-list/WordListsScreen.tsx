import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PrimaryTextInput from "../../components/common/form/PrimaryTextInput";
import ModalControlButtons from "../../components/common/modal/ModalControlButtons";
import ModalWrapper from "../../components/common/ModalWrapper";
import { useNavigation } from "@react-navigation/native";
import { TWordList } from "./types";
import WordListFilter from "../../components/word-bank/word-list/WordListFilter";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import WordListCard from "../../components/word-bank/word-list/WordListCard";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { isEmptyObj } from "../../components/utils";
import PrimarySwitch from "../../components/common/form/PrimarySwitch";
import FloatingButton from "../../components/common/FloatingButton";

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
      pinned: false,
      favorite: false,
      isActive: true,
    },
    mode: "onSubmit",
  });

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
    if (!isEmptyObj(methods.formState.errors)) {
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
      pinned: data.pinned,
      isActive: data.isActive,
      imageUrl: "https://picsum.photos/270",
      favorite: data.favorite,
    };

    const updatedWordLists = [...wordLists, newWordList];
    setWordLists(updatedWordLists);
    setFilteredWordLists(updatedWordLists);
    setAddListModalVisible(false);
    methods.reset();
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
    navigation.navigate("Word List Details", { list: selectedList });
  };

  const renderSkeleton = () => {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 4 }).map(
          (
            _,
            index // Adjust the number of rows as needed
          ) => (
            <View key={index} style={styles.skeletonRow}>
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={styles.skeletonRectangle}
              />
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={styles.skeletonRectangle}
              />
            </View>
          )
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <WordListFilter
          wordLists={wordLists}
          setFilteredWordLists={setFilteredWordLists}
        />
      </View>
      {isLoading ? (
        renderSkeleton()
      ) : (
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
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.wordListContainer}
          />
        </View>
      )}
      <FloatingButton handlePress={handleOpenAddListModal} />
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
            <PrimarySwitch
              name="pinned"
              label="Pin this list"
              defaultValue={false}
            />
            <PrimarySwitch
              name="favorite"
              label="Add to favorites"
              defaultValue={false}
            />
            <PrimarySwitch
              name="isActive"
              label="Set as active list"
              defaultValue={true}
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
    paddingHorizontal: 10,
    flex: 1,
  },
  formContent: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: 20,
  },
  formControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 35,
  },
  skeletonContainer: {
    flex: 8,
    paddingHorizontal: 20,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonRectangle: {
    width: "48%",
    borderRadius: 4,
    height: 140,
  },
});

export default WordListsScreen;
