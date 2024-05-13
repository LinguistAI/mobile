import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Colors from '../../theme/colors';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  noShadow?: boolean;
}

const Card = ({ children, style, noShadow }: CardProps) => {
  return (
    <View style={[styles.card, style, noShadow ? { shadowColor: 'transparent', elevation: 0 } : {}]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: Colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 12,
  },
});

export default Card;
