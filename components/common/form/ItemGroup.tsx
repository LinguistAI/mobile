import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import Colors from '../../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import OptionGroup from './OptionGroup';

type Item = {
  name: string;
  value: string;
};

type ItemGroupProps = {
  items: Item[];
  onChange: (value: string[]) => void;
  label: string;
  name: string;
  addable: boolean;
  itemOptions?: Item[];
  noItemsText?: string;
};

const ItemGroup: React.FC<ItemGroupProps> = ({
  items,
  onChange,
  label,
  addable,
  itemOptions,
  noItemsText,
  name,
}) => {
  const [displayedItems, setDisplayedItems] = useState<Item[]>(items);
  const [showOptions, setShowOptions] = useState(false);

  const handleDeleteItem = (valueToDelete: string) => {
    const updatedItems = displayedItems.filter((item) => item.value !== valueToDelete);
    setDisplayedItems(updatedItems);
    onChange(updatedItems.map((item) => item.value));
  };

  const handleAddItems = (selectedHobbies: string[]) => {
    const updatedItems = [...displayedItems, ...selectedHobbies.map((name) => ({ value: name, name }))];
    setDisplayedItems(updatedItems);
    onChange(updatedItems.map((item) => item.value));
    setShowOptions(false);
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <ScrollView style={styles.container}>
        {displayedItems.length === 0 ? (
          <View style={styles.rowContainer}>
            <Text style={styles.noItemsText}>{noItemsText}</Text>
            {addable && (
              <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={32} color={Colors.primary['500']} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.itemGroup}>
            {displayedItems.map((item) => (
              <View key={item.value} style={[styles.item]}>
                <Text style={styles.itemText}>{item.name} </Text>
                <TouchableOpacity onPress={() => handleDeleteItem(item.value)}>
                  <Ionicons name="close-circle-outline" size={18} color={Colors.gray[0]} />
                </TouchableOpacity>
              </View>
            ))}
            {addable && (
              <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={32} color={Colors.primary['500']} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <Modal visible={showOptions} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setShowOptions(false)} style={styles.closeButton}>
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            {itemOptions ? (
              <OptionGroup
                items={itemOptions
                  .filter((option) => !displayedItems.some((item) => item.value === option.value))
                  .map((option) => ({
                    value: option.value,
                    name: option.name,
                  }))}
                multiple={true}
                onSelectionDone={(selectedHobbies: string[]) => handleAddItems(selectedHobbies)}
              />
            ) : (
              <Text>No items to add</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, // Add some spacing between the label and the items
  },
  label: {
    fontSize: 16,
    color: Colors.gray[900],
    fontWeight: 'bold',
  },
  noItemsText: {
    fontSize: 16,
    color: Colors.gray[900],
    margin: 6,
  },
  btnContainer: {
    margin: 10,
  },
  container: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary['500'],
  },
  itemGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  item: {
    margin: 3,
    backgroundColor: Colors.primary['400'],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.gray['0'],
  },
  addButton: {
    alignSelf: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  closeButton: {
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Vertically align items
  },
});

export default ItemGroup;
