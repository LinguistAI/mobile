import React from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import { IStoreItem, IStoreItemWithQuantity } from '../types';
import { TYPE_DOUBLE_ANSWER, TYPE_ELIMINATE_WRONG_ANSWER } from '../constants';

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
            <TouchableOpacity
              style={styles.gemsButton}
              onPress={onGemsPress}
              activeOpacity={0.8} // To reduce the opacity when pressed
            >
              <Text style={styles.price}>{`${storeItem.price} gems`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20, // Increased margin for better separation
    width: '48%',
    position: 'relative',
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: Colors.gray[0],
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    minHeight:50,
    textAlignVertical: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.gray['900'],
    textAlign: 'center',
    marginBottom: 5, 
    minHeight:70,
    textAlignVertical: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.gray[0],
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  typeContainer: {
    width: 120, // Set a fixed width for the type container
  },
});

export default StoreItemCard;
