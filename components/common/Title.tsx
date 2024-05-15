import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import TitleSizes from '../../theme/fontSizes';
import Colors from '../../theme/colors';

type FontSizeKeys = keyof typeof TitleSizes;

interface TitleProps {
  children: React.ReactNode;
  size?: FontSizeKeys;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Title = ({ children, size: fontSize = 'h1', centered, style }: TitleProps) => {
  const textAlign = centered ? 'center' : 'left';
  let currentStyle = style ? style : styles.titleTextCustom;

  return <Text style={[currentStyle, { fontSize: TitleSizes[fontSize], textAlign }]}>{children}</Text>;
};

const styles = StyleSheet.create({
  titleTextCustom: {
    fontSize: 24,
    fontFamily: 'Bold',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: '',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
});

export default Title;
