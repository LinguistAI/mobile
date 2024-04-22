import { StyleSheet, Text } from 'react-native';
import TitleSizes from '../../theme/fontSizes';

type FontSizeKeys = keyof typeof TitleSizes;

interface TitleProps {
  children: React.ReactNode;
  size?: FontSizeKeys;
  centered?: boolean;
}

const Title = ({ children, size: fontSize = 'h1', centered }: TitleProps) => {
  const textAlign = centered ? 'center' : 'left';
  let currentStyle = styles.titleTextCustom;

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
