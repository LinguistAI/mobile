import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  size?: number;
  onPress?: () => void;
  centered?: boolean;
  marginHorizontal?: number;
}

const LText = ({ children, style, centered, marginHorizontal = 0, size, onPress }: TextProps) => {
  const textAlign = centered ? 'center' : 'left';

  let currentStyle = styles.titleTextCustom;
  let mergedStyle = StyleSheet.compose(currentStyle, style as TextStyle);

  if (style && (style as TextStyle).fontWeight === 'bold') {
    const { fontWeight, ...rest } = style as TextStyle;
    mergedStyle = StyleSheet.compose(styles.titleTextCustomBolder, rest);
  }

  if (size) {
    mergedStyle = StyleSheet.compose(mergedStyle, { fontSize: size });
  }

  console.log('aloo', mergedStyle);

  const content = (
    <Text style={[mergedStyle, { textAlign, marginHorizontal: marginHorizontal }]}>{children}</Text>
  );

  return onPress ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content;
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
