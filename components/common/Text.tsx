import { Animated, Easing, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  onPress?: () => void;
  centered?: boolean;
  marginHorizontal?: number;
  isAnimated?: boolean;
  animationTrigger?: any;
  animationSequence?: () => void;
  scaleAnimation?: any;
}

const LText = ({
  children,
  style,
  centered,
  marginHorizontal = 0,
  size,
  onPress,
  isAnimated = false,
  animationTrigger,
  animationSequence,
  scaleAnimation,
}: TextProps) => {
  const textAlign = centered ? 'center' : 'left';

  let currentStyle = styles.titleTextCustom;
  let mergedStyle = StyleSheet.compose(currentStyle, style);

  if (Array.isArray(style)) {
    const flattenedStyles = style.flat().filter((item) => item !== null);
    mergedStyle = Object.assign({}, ...flattenedStyles);
  } else {
    mergedStyle = style;
  }

  if (mergedStyle && (mergedStyle as TextStyle).fontWeight === 'bold') {
    const { fontWeight, ...rest } = mergedStyle as TextStyle;
    mergedStyle = StyleSheet.compose(styles.titleTextCustomBolder, rest);
  } else if (mergedStyle && (mergedStyle as TextStyle).fontWeight === '300') {
    const { fontWeight, ...rest } = mergedStyle as TextStyle;
    mergedStyle = StyleSheet.compose(styles.titleTextCustomBold, rest);
  }

  // if size prop is seperetaly set, override other font size values
  if (size) {
    mergedStyle = StyleSheet.compose(mergedStyle, { fontSize: size });
  }

  const scaleAnim = scaleAnimation;
  const triggerAnimation = animationSequence;

  useEffect(() => {
    if (animationTrigger !== null && triggerAnimation) triggerAnimation();
  }, [animationTrigger]);

  if (isAnimated) {
    return (
      <Animated.Text
        onPress={onPress}
        style={[
          mergedStyle,
          { textAlign, marginHorizontal: marginHorizontal, transform: [{ scale: scaleAnim }] },
        ]}
      >
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
