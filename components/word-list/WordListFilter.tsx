import { StyleSheet, Text, TextInput, View } from "react-native";
import ActionIcon from "../common/ActionIcon";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import ModalControlButtons from "../common/modal/ModalControlButtons";
import { Picker } from "@react-native-picker/picker";
import { TWordList } from "../../screens/word-list/types";
import { IFilterCriteria } from "./types";
import { search } from "./utils";
import { defaultFilter } from "./constants";

interface WordListFilterProps {
  wordLists: TWordList[];
  setFilteredWordLists: (wordLists: TWordList[]) => void;
}

const WordListFilter = ({
  wordLists,
  setFilteredWordLists,
}: WordListFilterProps) => {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [tempFilter, setTempFilter] =
    useState<IFilterCriteria<TWordList>>(defaultFilter);
  const [filter, setFilter] = useState<IFilterCriteria<TWordList>>({
    search: {
      searchText: "",
      searchFn: (searchText: string) => search(searchText, wordLists),
    },
    sort: {
      accessor: "title",
      order: "desc",
    },
  });

  // Filter effect
  useEffect(() => {
    let filteredWordLists = [...wordLists];

    filteredWordLists = filter.search.searchFn(
      filter?.search?.searchText,
      wordLists
    );

    if (tempFilter?.sort?.accessor) {
      filteredWordLists = filteredWordLists.sort((a, b) => {
        if (tempFilter?.sort?.order === "asc") {
          if (a[tempFilter?.sort?.accessor] < b[tempFilter?.sort?.accessor]) {
            return -1;
          }
          if (a[tempFilter?.sort?.accessor] > b[tempFilter?.sort?.accessor]) {
            return 1;
          }
          return 0;
        } else {
          if (a[tempFilter?.sort?.accessor] > b[tempFilter?.sort?.accessor]) {
            return -1;
          }
          if (a[tempFilter?.sort?.accessor] < b[tempFilter?.sort?.accessor]) {
            return 1;
          }
          return 0;
        }
      });
    }

    setFilteredWordLists(filteredWordLists);
  }, [filter, wordLists]);

  const handleSetTempFilter = <
    TWordList,
    TTarget extends keyof IFilterCriteria<TWordList>,
    TKey extends keyof IFilterCriteria<TWordList>[TTarget],
  >(
    target: TTarget,
    key: TKey,
    value: Object
  ) => {
    setTempFilter({
      ...tempFilter,
      [target]: { ...tempFilter[target], [key]: value },
    });
  };

  const handleClearFilter = () => {
    setTempFilter({
      search: {
        searchText: "",
        searchFn: (searchText: string) => search(searchText, wordLists),
      },
      sort: {
        accessor: "title",
        order: "desc",
      },
    });
    setOpenFilterModal(false);
  };

  const handleApplyFilter = () => {
    setOpenFilterModal(false);
    setFilter(tempFilter);
  };

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
                search: {
                  ...filter.search,
                  searchText: value,
                },
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
                    search: {
                      ...filter.search,
                      searchText: "",
                    },
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
            <View style={styles.pickerRow}>
              <Text style={styles.label}>Order By:</Text>
              <View style={styles.actionRow}>
                <View style={styles.picker}>
                  <Picker
                    itemStyle={styles.pickerItem}
                    selectedValue={tempFilter?.sort?.accessor}
                    onValueChange={(itemValue) =>
                      handleSetTempFilter("sort", "accessor", itemValue)
                    }
                  >
                    <Picker.Item label="Title" value="title" />
                    <Picker.Item label="Description" value="description" />
                    <Picker.Item label="Pinned" value="pinned" />
                    <Picker.Item label="Active" value="isActive" />
                  </Picker>
                </View>
                <ActionIcon
                  icon={
                    tempFilter?.sort?.order === "asc" ? (
                      <Ionicons
                        name="arrow-up-outline"
                        size={24}
                        color={Colors.gray[700]}
                      />
                    ) : (
                      <Ionicons
                        name="arrow-down-outline"
                        size={24}
                        color={Colors.gray[700]}
                      />
                    )
                  }
                  onPress={() =>
                    handleSetTempFilter(
                      "sort",
                      "order",
                      tempFilter?.sort?.order === "asc" ? "desc" : "asc"
                    )
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.formControls}>
            <ModalControlButtons
              onCancel={handleClearFilter}
              onSubmit={handleApplyFilter}
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
    borderColor: Colors.primary[600],
    borderWidth: 2,
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
    justifyContent: "center",
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
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.gray[600],
    borderRadius: 4,
    marginBottom: 20,
    textAlign: "center",
  },
  actionIconContainer: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.primary[600],
    borderRadius: 4,
    padding: 5,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});

export default WordListFilter;
