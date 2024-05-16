import {
  Animated,
  StyleSheet,
  View,
  Image,
  ViewStyle,
  StyleProp,
  Easing,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../theme/colors';
import LText from '../../common/Text';
import React, { useEffect, useRef, useState } from 'react';
import ActionButton from '../../common/ActionButton';

interface GemsIndicatorButtonProps {
  gemCount: number | null;
  onClick: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const GemsIndicatorButton = ({ gemCount, onClick, style, loading = false }: GemsIndicatorButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const trueGemCount = loading ? (
    <ActivityIndicator style={styles.loading} size="small" color={Colors.gray[0]} />
  ) : (
    gemCount
  );

  return (
    <View style={[styles.root, style]}>
      <ActionButton
        bgColor={Colors.primary[500]}
        onPress={onClick}
        marginTop={-10}
        marginBottom={-10}
        title={
          <View style={styles.root}>
            <LText
              style={styles.gems}
              isAnimated={true}
              animationTrigger={gemCount}
              animationSequence={triggerAnimation}
              scaleAnimation={scaleAnim}
            >
              {trueGemCount ?? 0}
            </LText>
            <Image source={require('../../../assets/gem1.png')} style={styles.image} />
          </View>
        }
        icon={<></>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  loading: {
    marginBottom: -5,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: -5,
  },
  text: {
    fontSize: 20,
    color: Colors.gray[100],
  },
  gems: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.gray[100],
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0.5, height: 2 },
    textShadowRadius: 1,
    marginRight: 2,
  },
});

export default GemsIndicatorButton;
