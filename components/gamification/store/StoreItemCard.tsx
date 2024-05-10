import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import { IStoreItemWithQuantity } from '../types';
import { TYPE_DOUBLE_ANSWER, TYPE_ELIMINATE_WRONG_ANSWER } from './constants';
import GemsIndicatorButton from '../transaction/GemsIndicatorButton';

interface ItemProps {
  storeItem: IStoreItemWithQuantity;
  onGemsPress: () => void;
}

const StoreItemCard = ({ storeItem, onGemsPress }: ItemProps) => {
  const cardTitle = storeItem.type;

  const renderIcon = () => {
    if (storeItem.type === TYPE_DOUBLE_ANSWER) {
      return <Ionicons name="checkmark-done-sharp" size={60} color={Colors.gray[900]} />;
    } else if (storeItem.type === TYPE_ELIMINATE_WRONG_ANSWER) {
      return <Ionicons name="trash-bin-outline" size={60} color={Colors.gray[900]} />;
    }
  };

  return (
    <Pressable style={styles.card}>
      <View key={storeItem.id}>
        <View>
          <View style={styles.overlay}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantity}>{storeItem.quantityOwned}</Text>
            </View>
            {renderIcon()}
            <View style={styles.details}>
              <Text style={styles.title}>{cardTitle}</Text>
              <Text style={styles.description}>{storeItem.description}</Text>
            </View>
            <GemsIndicatorButton gemCount={storeItem.price} onClick={onGemsPress} style={styles.gemsButton} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    width: '48%',
    position: 'relative',
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: Colors.gray[0],
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginTop: 20,
  },
  details: {
    marginBottom: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray['900'],
    textAlign: 'center',
    marginBottom: 5,
    minHeight: 50,
    textAlignVertical: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.gray['900'],
    textAlign: 'center',
    marginBottom: 5,
    minHeight: 70,
    textAlignVertical: 'center',
  },
  overlay: {
    backgroundColor: Colors.gray['0'],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
    alignItems: 'center',
  },
  quantityContainer: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: Colors.grape['900'],
    borderRadius: 50, // A circle
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray['0'],
    zIndex: 1,
  },
  quantity: {
    color: Colors.gray['0'],
    fontWeight: 'bold',
  },
  gemsButton: {
    justifyContent: 'center',
  },
});

export default StoreItemCard;
