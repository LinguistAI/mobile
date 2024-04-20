import { useFonts } from 'expo-font';
import { useContext } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { FontLoadedContext } from '../../App';
import TitleSizes from '../../theme/fontSizes';

interface TextProps {
  children: React.ReactNode;
  size?: number;
  style: StyleProp<TextStyle>;
  centered?: boolean;
}

const LText = ({ children, size = 12, style, centered }: TextProps) => {
  const textAlign = centered ? 'center' : 'left';
  const fontsLoaded = useContext(FontLoadedContext);
  let currentStyle = styles.titleTextCustom;

  if (!fontsLoaded) {
    currentStyle = styles.titleText;
  }

  return <Text style={[currentStyle, { fontSize: size, textAlign }, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  titleTextCustom: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
  titleTextCustomBold: {
    fontSize: 12,
    fontFamily: 'NunitoBold',
  },
  titleTextCustomBolder: {
    fontSize: 12,
    fontFamily: 'NunitoBolder',
  },
  titleText: {
    fontSize: 12,
    fontFamily: '',
  },
});

export default LText;
