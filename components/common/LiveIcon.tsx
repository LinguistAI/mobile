import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export default function GreenCircleIcon() {
  // Initial scale value
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const animateCircle = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      animateCircle();
    });
  };

  React.useEffect(() => {
    animateCircle();
  }, []);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <LinearGradient
        colors={['#92cdff', '#3b5998', '#0e1e2b']}
        style={{
          flex: 1,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 15,
    height: 15,
    backgroundColor: 'green',
    borderRadius: 25,
  },
});
