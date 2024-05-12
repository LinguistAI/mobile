import {Animated, Easing, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity} from 'react-native';
import React, { useEffect, useRef } from 'react';

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  onPress?: () => void;
  centered?: boolean;
  marginHorizontal?: number;
  animation?: {
    isAnimated: boolean;
    animationTrigger: any;
    animationSequence: () => void;
    scaleAnimation: any;
  };
}

const LText = (
  {
    children,
    style,
    centered,
    marginHorizontal = 0,
    size,
    onPress,
    animation = { isAnimated: false, animationTrigger: null, animationSequence: () => {}, scaleAnimation: null }
  }: TextProps
) => {
  const textAlign = centered ? 'center' : 'left';

  let currentStyle = styles.titleTextCustom;
  let mergedStyle = StyleSheet.compose(currentStyle, style);

  // if the custom style includes font weight bold, remove it and set the bold version of the default font
  if (style && (style as TextStyle).fontWeight === 'bold') {
    const { fontWeight, ...rest } = style as TextStyle;
    mergedStyle = StyleSheet.compose(styles.titleTextCustomBolder, rest);
  }
  if (style && (style as TextStyle).fontWeight === '300') {
    const { fontWeight, ...rest } = style as TextStyle;
    mergedStyle = StyleSheet.compose(styles.titleTextCustomBold, rest);
  }

  // if size prop is seperetaly set, override other font size values
  if (size) {
    mergedStyle = StyleSheet.compose(mergedStyle, { fontSize: size });
  }

  const scaleAnim = animation?.scaleAnimation;
  const triggerAnimation = animation?.animationSequence;

  useEffect(() => {
    if (animation?.animationTrigger !== null && triggerAnimation) triggerAnimation();
  }, [animation?.animationTrigger]);

  if (animation?.isAnimated) {
    return (
      <Animated.Text onPress={onPress} style={[mergedStyle, { textAlign, marginHorizontal: marginHorizontal, transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.Text>
    );
  }

  return (
    <Text onPress={onPress} style={[mergedStyle, { textAlign, marginHorizontal: marginHorizontal }]}>
      {children}
    </Text>
  );
};
const styles = StyleSheet.create({
  titleTextCustom: {
    fontFamily: 'Regular',
  },
  titleTextCustomBold: {
    fontFamily: 'SemiBold',
  },
  titleTextCustomBolder: {
    fontFamily: 'Bold',
  },
  titleText: {
    fontSize: 12,
    fontFamily: '',
  },
});

export default LText;
