import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  marked?: boolean;
  markedIcon?: React.ReactNode;
}

const Badge = ({ label, backgroundColor, textColor, marked, markedIcon }: BadgeProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: textColor }}>{label}</Text>
      <View style={[styles.badge, { backgroundColor }]}>{markedIcon}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#000',
  },
});

export default Badge;
