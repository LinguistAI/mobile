import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '../../theme/colors';
import { ActiveIconShades } from '../word-bank/word-list/types';

interface ActiveWordListIconProps {
  animated?: boolean;
  shades?: ActiveIconShades;
}

export default function ActiveWordListIcon({
  animated = true,
  shades = ActiveIconShades.ACTIVE,
}: ActiveWordListIconProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const getOuterColor = () => {
    switch (shades) {
      case ActiveIconShades.ACTIVE:
        return Colors.green[100];
      case ActiveIconShades.DEACTIVATE:
        return Colors.gray[600];
      default:
        return Colors.green[100];
    }
  };
  const getMidColor = () => {
    switch (shades) {
      case ActiveIconShades.ACTIVE:
        return Colors.green[300];
      case ActiveIconShades.DEACTIVATE:
        return Colors.gray[600];
      default:
        return Colors.green[300];
    }
  };
  const getInnerColor = () => {
    switch (shades) {
      case ActiveIconShades.ACTIVE:
        return Colors.green[500];
      case ActiveIconShades.DEACTIVATE:
        return Colors.gray[700];
      default:
        return Colors.green[500];
    }
  };

  const styles = StyleSheet.create({
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    outerCircle: {
      width: 18,
      height: 18,
      borderRadius: 25,
      backgroundColor: getOuterColor(),
    },
    middleCircle: {
      width: 13,
      height: 13,
      borderRadius: 25,
      backgroundColor: getMidColor(),
    },
    innerCircle: {
      width: 11,
      height: 11,
      borderRadius: 25,
      backgroundColor: getInnerColor(),
    },
  });

  const animateCircle = () => {
    if (animated) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
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
    }
  };

  useEffect(() => {
    animateCircle();
  }, [animated]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        styles.outerCircle,
        animated && {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <Animated.View style={[styles.iconContainer, styles.middleCircle]}>
        <Animated.View style={[styles.iconContainer, styles.innerCircle]} />
      </Animated.View>
    </Animated.View>
  );
}
