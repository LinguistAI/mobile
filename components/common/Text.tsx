import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

interface TextProps {
  children: React.ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
  centered?: boolean;
  marginHorizontal?: number;
}

const LText = ({ children, size = 16, style, centered, marginHorizontal = 0 }: TextProps) => {
  const textAlign = centered ? 'center' : 'left';
  let currentStyle = styles.titleTextCustom;

  if (style && (style as TextStyle).fontWeight === 'bold') {
    const { fontWeight, ...rest } = style as TextStyle;
    currentStyle = {
      ...styles.titleTextCustomBolder,
      ...rest,
    };
  }

  return (
    <Text style={[currentStyle, { fontSize: size, textAlign, marginHorizontal: marginHorizontal }]}>{children}</Text>
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
