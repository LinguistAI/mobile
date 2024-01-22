import { StyleSheet, Text, TextInput, View } from "react-native";
import ActionIcon from "../common/ActionIcon";
import Colors from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";

interface WordListFilterProps {
  label?: string;
  rightIcon?: React.ReactNode;
}

const WordListFilter = ({ filter, setFilter }) => {
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
            style={[styles.textInput]}
            onChangeText={(value) => handleSetFilter("title", value)}
            value={filter["title"]}
            placeholder="Search by title, description, or word"
          />
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
          onPress={() => console.log("filter")}
        />
      </View>
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
    flexBasis: "85%",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 8,
    width: "100%",
  },
  inputRoot: {
    flex: 8,
    height: 50,
    borderWidth: 2,
    borderBottomColor: Colors.gray[400],
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    color: Colors.gray[600],
  },
});

export default WordListFilter;
