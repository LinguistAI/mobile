import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../theme/colors'; // Make sure this path matches your project structure

interface ShimmerButtonProps {
  title: string;
  animated?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const ShimmerButton = ({ title, onPress, animated = true, disabled = false }: ShimmerButtonProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!disabled && animated) {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      animatedValue.setValue(0);
    }
  }, [animatedValue, disabled]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <TouchableOpacity onPress={!disabled ? onPress : undefined} activeOpacity={!disabled ? 0.2 : 1}>
      <View style={[styles.buttonContainer, disabled && styles.disabledButton]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX: translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['#ffffff00', '#ffffff', '#ffffff00']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.grape[500],
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: Colors.gray[300],
  },
});

export default ShimmerButton;
