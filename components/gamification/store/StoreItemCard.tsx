import React, { useRef, useEffect } from 'react';
import {View, Text, Pressable, StyleSheet, Animated, Easing} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../theme/colors';
import { IStoreItemWithQuantity } from '../types';
import {
  TYPE_DOUBLE_ANSWER,
  TYPE_DOUBLE_ANSWER_OLD,
  TYPE_ELIMINATE_WRONG_ANSWER,
  TYPE_ELIMINATE_WRONG_ANSWER_OLD,
} from './constants';
import GemsIndicatorButton from '../transaction/GemsIndicatorButton';
import LText from "../../common/Text";

interface ItemProps {
  gemDisplay: any,
  storeItem: IStoreItemWithQuantity;
  onGemsPress: () => void;
  purchasing: boolean;
}

const StoreItemCard = ({ gemDisplay, storeItem, onGemsPress, purchasing = false }: ItemProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.8,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
      }),
    ]).start();
  };

  useEffect(() => {
    if (storeItem.quantityOwned !== null && triggerAnimation) triggerAnimation();
  }, [storeItem.quantityOwned]);

  const cardTitle = storeItem.type;

  const renderIcon = () => {
    if (storeItem.type === TYPE_DOUBLE_ANSWER || storeItem.type === TYPE_DOUBLE_ANSWER_OLD) {
      return <Ionicons style={styles.icon} name="checkmark-done-sharp" size={60} color={Colors.gray[900]} />;
    } else if (storeItem.type === TYPE_ELIMINATE_WRONG_ANSWER || storeItem.type === TYPE_ELIMINATE_WRONG_ANSWER_OLD) {
      return <Ionicons style={styles.icon} name="trash-bin-outline" size={60} color={Colors.gray[900]} />;
    }
  };

  return (
    <Pressable style={styles.card}>
      <View key={storeItem.id}>
        <View>
          <View style={styles.overlay}>
            <View style={styles.quantityContainer}>
              <LText style={styles.quantity} animation={
                {
                  isAnimated: true,
                  animationTrigger: storeItem.quantityOwned,
                  animationSequence: triggerAnimation,
                  scaleAnimation: scaleAnim,
                }
              }>{storeItem.quantityOwned ?? 0}</LText>
            </View>
            {renderIcon()}
            <View style={styles.details}>
              <LText centered={true} style={styles.title}>{cardTitle}</LText>
              <Text style={styles.description}>{storeItem.description}</Text>
            </View>
            <GemsIndicatorButton gemCount={gemDisplay} onClick={onGemsPress} style={styles.gemsButton} loading={purchasing} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'space-between',
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
  icon: {
    marginTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray['900'],
    textAlign: 'center',
    marginBottom: 5,
    minHeight: 50,
    textAlignVertical: 'center',
  },
  description: {
    marginTop: -15,
    fontSize: 14,
    color: Colors.gray['900'],
    textAlign: 'center',
    marginBottom: 5,
    minHeight: 70,
    textAlignVertical: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
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
    backgroundColor: Colors.primary[500],
    borderTopColor: Colors.primary[600],
    borderBottomColor: Colors.primary[600],
    borderRightColor: Colors.primary[600],
    borderLeftColor: Colors.primary[600],
    borderRadius: 50, // A circle
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray['0'],
    zIndex: 1,
  },
  quantity: {
    color: Colors.gray['0'],
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0.5, height: 2 },
    textShadowRadius: 1,
  },
  gemsButton: {
    justifyContent: 'center',
  },
});

export default StoreItemCard;
