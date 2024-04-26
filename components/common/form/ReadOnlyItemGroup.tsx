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

type ReadOnlyItemGroupProps = {
  items: Item[];
  label?: string;
  name: string;
  noItemsText?: string;
};

const ReadOnlyItemGroup: React.FC<ReadOnlyItemGroupProps> = ({ items, label, name, noItemsText }) => {
  const [displayedItems, setDisplayedItems] = useState<Item[]>(items);

  return (
    <View>
      <View style={styles.labelContainer}>{label ? <Text style={styles.label}>{label}</Text> : null}</View>
      <ScrollView style={styles.container}>
        {displayedItems.length === 0 ? (
          <View style={styles.rowContainer}>
            <Text style={styles.noItemsText}>{noItemsText}</Text>
          </View>
        ) : (
          <View style={styles.itemGroup}>
            {displayedItems.map((item) => (
              <View key={item.value} style={[styles.item]}>
                <Text style={styles.itemText}>{item.name} </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0, // Add some spacing between the label and the items
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
    // paddingVertical: 3,
    paddingHorizontal: 3,
    // borderRadius: 4,
    // borderWidth: 2,
    // borderColor: Colors.gray['500'],
  },
  itemGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
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

export default ReadOnlyItemGroup;
