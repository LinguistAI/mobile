import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "../../../theme/colors";
import ActionButton from "../ActionButton";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";

type OptionItem = {
  name: string;
  value: string;
};

type OptionGroupProps = {
  items: OptionItem[];
  onSelectionDone: (value: string[]) => void;
  multiple?: boolean;
};

const OptionGroup: React.FC<OptionGroupProps> = ({
  items,
  onSelectionDone,
  multiple=false
}) => {
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    if (multiple) {
      const isSelected = selectedValue.findIndex((v) => v === value)
      if (isSelected === -1) {
        setSelectedValue(prev => [
          ...prev,
          value
        ])
      } else {
        setSelectedValue((prev) => [
          ...prev.slice(0, isSelected),
          ...prev.slice(isSelected+1)
        ])
      }
    } else {
      setSelectedValue([value]);
    }
  };

  const handleSelectionDone = () => {
    onSelectionDone(selectedValue)
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        <View style={styles.optionGroup}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleSelect(item.value)}
              style={[
                styles.option,
                selectedValue.includes(item.value) && styles.selectedOption,
              ]}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Button
          type="primary"
          onPress={handleSelectionDone}
        >
          SELECT
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    margin: 10,
  },
  container: {
    margin: 10,
    maxHeight: 250,
    borderColor: Colors.gray[600],
    borderWidth: 2,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  option: {
    margin: 4,
    backgroundColor: Colors.primary["400"],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedOption: {
    backgroundColor: Colors.primary["700"],
  },
  optionText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "white",
  },
});

export default OptionGroup;
