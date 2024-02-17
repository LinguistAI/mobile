import { View, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PrimaryTextInput from "../../components/common/form/PrimaryTextInput";
import ModalControlButtons from "../../components/common/modal/ModalControlButtons";
import ModalWrapper from "../../components/common/ModalWrapper";
import { useNavigation } from "@react-navigation/native";
import { ICreateWordList, TWordList } from "./types";
import WordListFilter from "../../components/word-bank/word-list/WordListFilter";
import WordListCard from "../../components/word-bank/word-list/WordListCard";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { isEmptyObj } from "../../components/utils";
import PrimarySwitch from "../../components/common/form/PrimarySwitch";
import FloatingButton from "../../components/common/FloatingButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createList, getLists } from "./WordList.service";
import { APIResponse } from "../common";
import { generateErrorResponseMessage } from "../../utils/httpUtils";
import useNotifications from "../../hooks/useNotifications";

const WordListsScreen = () => {
  const queryClient = useQueryClient();
  const { data: wordListsServer } = useQuery({
    queryFn: () => getLists(),
    queryKey: ["getWordLists"],
    refetchOnWindowFocus: true,
  });
  const { mutate: createListMutate, isPending} = useMutation({
    mutationFn: (data: ICreateWordList) => createList(data),
    mutationKey: ["createWordList"],
    onSuccess: (data: APIResponse<TWordList>) => {
      if (!data || !data.data) {
        addNotification({body: "Something went wrong while creating the wordlist.", type: "error"})
        return;
      }
      
      queryClient.invalidateQueries({queryKey: ["getWordLists"]})
      methods.reset();
    },
    onError: (error: any) => {
      const msg = generateErrorResponseMessage(error)
      addNotification({body: msg, type: "error"})
    }
  })
  const wordLists = wordListsServer?.data?.lists || []
  const [filteredWordLists, setFilteredWordLists] = useState<TWordList[]>([]);
  const [addListModalVisible, setAddListModalVisible] = useState(false);
  const navigation = useNavigation();
  const {add: addNotification} = useNotifications()
  const methods = useForm({
    defaultValues: {
      listName: "",
      listDescription: "",
      pinned: false,
      favorite: false,
      isActive: true,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (wordListsServer?.data) {
      setFilteredWordLists(wordListsServer?.data?.lists)
    }
  }, [wordListsServer])
  
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

  if (!wordListsServer) {
    return renderSkeleton()
  }

  const validateSubmit = (data: any) => {
    wordListsServer?.data?.lists?.forEach((list) => {
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
    setAddListModalVisible(false);
    if (!isEmptyObj(methods.formState.errors)) {
      return;
    }

    const createWordList: ICreateWordList = {
      title: data.listName,
      description: data.listDescription,
      isActive: data.isActive,
      isFavorite: data.favorite,
      isPinned: data.pinned,
    };
    createListMutate(createWordList);

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
    const selectedList = wordLists.find((list) => list.listId === listId);
    navigation.navigate("WordListDetails", { list: selectedList });
  };

  const updateList = (updatedList: TWordList) => {
    const listIndex = wordLists.findIndex(list => list.listId === updatedList.listId)
    setFilteredWordLists([
      ...wordLists.slice(0, listIndex),
      updatedList,
      ...wordLists.slice(listIndex +  1)
    ])
  }

  const deleteList = (listId: string) => {
    setFilteredWordLists(wordLists.filter(list => list.listId !== listId))
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <WordListFilter
          wordLists={wordListsServer?.data?.lists || []}
          setFilteredWordLists={setFilteredWordLists}
        />
      </View>
      {isPending ? (
        renderSkeleton()
      ) : (
        <View style={{ flex: 8 }}>
          <FlatList
            data={filteredWordLists}
            renderItem={({ item }) => (
              <WordListCard
                key={item.listId}
                list={item}
                handleListSelection={handleListSelection}
                updateList={updateList}
                deleteList={deleteList}
              />
            )}
            numColumns={2}
            keyExtractor={(item) => item.listId}
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
