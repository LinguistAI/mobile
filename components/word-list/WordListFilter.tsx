import { StyleSheet, Text, TextInput, View } from "react-native";
import ActionIcon from "../common/ActionIcon";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import ModalControlButtons from "../common/modal/ModalControlButtons";
import { FormProvider } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import Divider from "../common/Divider";
import { TWordList } from "../../screens/word-list/types";

interface WordListFilterProps {
  wordLists: TWordList[];
  setFilteredWordLists: (wordLists: TWordList[]) => void;
}

interface FilterCriteria<T> {
  sort?: {
    property: keyof T;
    order: "asc" | "desc";
  };
  search: {
    searchText: string;
    searchFn: (searchText: string, wordList: T[]) => T[];
  };
}

const WordListFilter = ({
  wordLists,
  setFilteredWordLists,
}: WordListFilterProps) => {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filter, setFilter] = useState<FilterCriteria<TWordList>>({
    search: {
      searchText: "",
      searchFn: (searchText: string) => search(searchText, wordLists),
    },
    sort: {
      property: "title",
      order: "desc",
    },
  });

  const search = (searchText: string, wordList: TWordList[]) => {
    const searchedList = wordList.filter(
      (list) =>
        list?.title?.toLowerCase().includes(searchText?.toLowerCase()) ||
        list?.description?.toLowerCase().includes(searchText?.toLowerCase()) ||
        list?.words?.some((word) =>
          word.word.toLowerCase().includes(searchText?.toLowerCase())
        )
    );
    return searchedList;
  };

  useEffect(() => {
    let filteredWordLists = [...wordLists];

    filteredWordLists = filter.search.searchFn(
      filter?.search?.searchText,
      wordLists
    );

    if (filter?.sort?.property) {
      filteredWordLists = filteredWordLists.sort((a, b) => {
        if (filter?.sort?.order === "asc") {
          if (a[filter?.sort?.property] < b[filter?.sort?.property]) {
            return -1;
          }
          if (a[filter?.sort?.property] > b[filter?.sort?.property]) {
            return 1;
          }
          return 0;
        } else {
          if (a[filter?.sort?.property] > b[filter?.sort?.property]) {
            return -1;
          }
          if (a[filter?.sort?.property] < b[filter?.sort?.property]) {
            return 1;
          }
          return 0;
        }
      });
    }

    setFilteredWordLists(filteredWordLists);
  }, [filter, wordLists]);

  return (
    <View style={styles.overallContainer}>
      <View style={styles.inputRoot}>
        <View style={[styles.inputContainer]}>
          <Ionicons
            name="search-outline"
            size={24}
            color={Colors.primary[600]}
          />
          <TextInput
            style={[
              styles.textInput,
              filter?.search?.searchText === "" ? { flexBasis: "90%" } : null,
            ]}
            onChangeText={(value) =>
              setFilter({
                ...filter,
                search: { ...filter.search, searchText: value },
              })
            }
            value={filter?.search?.searchText}
            placeholder="Search by title, description, or word"
          />

          {filter?.search?.searchText !== "" && (
            <View style={{ alignSelf: "center", marginRight: 20 }}>
              <ActionIcon
                icon={
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={Colors.primary[600]}
                  />
                }
                onPress={() =>
                  setFilter({
                    ...filter,
                    search: { ...filter.search, searchText: "" },
                  })
                }
              />
            </View>
          )}
        </View>
      </View>
      <View style={styles.filterOptionContainer}>
        <ActionIcon
          icon={
            <Ionicons
              name="options-outline"
              size={32}
              color={Colors.primary[600]}
            />
          }
          onPress={() => setOpenFilterModal(true)}
        />
      </View>
      <ModalWrapper
        onRequestClose={() => setOpenFilterModal(false)}
        visible={openFilterModal}
        title="Filter"
        width={300}
      >
        <View style={styles.formContent}>
          <View style={styles.orderByContainer}>
            {/* <View style={styles.pickerRow}>
              <Text style={styles.label}>Order By:</Text>
              <View style={styles.picker}>
                <Picker
                  itemStyle={styles.pickerItem}
                  selectedValue={filterCriteria.sort?.property}
                  onValueChange={(itemValue) =>
                    handleSetFilterCriteria("sort", {
                      ...filterCriteria.sort,
                      property: itemValue,
                    })
                  }
                >
                  <Picker.Item label="Title" value="title" />
                  <Picker.Item label="Description" value="description" />
                  <Picker.Item label="Word" value="word" />
                </Picker>
              </View>
            </View>
            <View style={styles.pickerRow}>
              <Text style={styles.label}>Order:</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={filterCriteria.sort?.order}
                  onValueChange={(itemValue) =>
                    handleSetFilterCriteria("sort", {
                      ...filterCriteria.sort,
                      order: itemValue,
                    })
                  }
                >
                  <Picker.Item label="Ascending" value="asc" />
                  <Picker.Item label="Descending" value="desc" />
                </Picker>
              </View>
            </View> */}
          </View>
          <View style={styles.formControls}>
            <ModalControlButtons
              onCancel={() => setOpenFilterModal(false)}
              onSubmit={() => setOpenFilterModal(false)}
              okText="Apply"
            />
          </View>
        </View>
      </ModalWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  overallContainer: {
    paddingHorizontal: 4,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterOptionContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  textInput: {
    flexBasis: "75%",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 8,
    width: "100%",
    gap: 6,
  },
  inputRoot: {
    flex: 8,
    height: 50,
    borderWidth: 2,
    borderBottomColor: Colors.primary[300],
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    color: Colors.gray[600],
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  orderByContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  pickerRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  pickerItem: {
    height: 60,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  picker: {
    width: 200,
    height: 60,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.gray[600],
    borderRadius: 4,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default WordListFilter;
