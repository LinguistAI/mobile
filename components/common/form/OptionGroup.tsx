import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../../../theme/colors";

type OptionItem = {
  name: string;
  value: string;
};

type OptionGroupProps = {
  items: OptionItem[];
  onSelectionChange?: (value: string) => void;
};

const OptionGroup: React.FC<OptionGroupProps> = ({
  items,
  onSelectionChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelectionChange?.(value);
  };

  return (
    <View style={styles.optionGroup}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.value}
          onPress={() => handleSelect(item.value)}
          style={[
            styles.option,
            item.value === selectedValue && styles.selectedOption,
          ]}
        >
          <Text style={styles.optionText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  option: {
    margin: 4,
    backgroundColor: Colors.primary["500"],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedOption: {
    backgroundColor: Colors.primary["600"], // Darker blue for the selected option
  },
  optionText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "white",
  },
});

export default OptionGroup;
