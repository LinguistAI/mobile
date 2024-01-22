import { StyleSheet, Text, TextInput, View } from "react-native";
import ActionIcon from "../common/ActionIcon";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { set } from "react-hook-form";
import { useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import ModalControlButtons from "../common/modal/ModalControlButtons";

interface WordListFilterProps {
  filter: any;
  setFilter: (filter: any) => void;
}

const WordListFilter = ({ filter, setFilter }: WordListFilterProps) => {
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const handleSetFilter = (key: string, value: any) => {
    setFilter({ ...filter, [key]: value });
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
              filter["title"] === "" ? { flexBasis: "90%" } : null,
            ]}
            onChangeText={(value) => handleSetFilter("title", value)}
            value={filter["title"]}
            placeholder="Search by title, description, or word"
          />

          {filter["title"] !== "" && (
            <View style={{ alignSelf: "center", marginRight: 20 }}>
              <ActionIcon
                icon={
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={Colors.primary[600]}
                  />
                }
                onPress={() => handleSetFilter("title", "")}
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
      >
        <View>
          <View>
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
});

export default WordListFilter;
