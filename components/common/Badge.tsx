import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface BadgeProps {
  label: string;
  subtitle?: string;
  backgroundColor: string;
  textColor: string;
  marked?: boolean;
  markedIcon?: React.ReactNode;
}

const Badge = ({ label, backgroundColor, textColor, marked, markedIcon, subtitle }: BadgeProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: textColor }}>{label}</Text>
      <View style={[styles.badge, { backgroundColor }]}>{markedIcon}</View>
      <Text style={styles.subtitle}>{subtitle}</Text>
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
  subtitle: {
    fontSize: 12,
    color: Colors.yellow[900],
    fontWeight: 'bold',
  },
});

export default Badge;
