import { StyleSheet, Text } from 'react-native';
import TitleSizes from '../../theme/fontSizes';
import Colors from '../../theme/colors';

type FontSizeKeys = keyof typeof TitleSizes;

interface TitleProps {
  children: React.ReactNode;
  size?: FontSizeKeys;
  centered?: boolean;
}

const Title = ({ children, size: fontSize = 'h1', centered }: TitleProps) => {
  const textAlign = centered ? 'center' : 'left';
  return <Text style={[styles.titleText, { fontSize: TitleSizes[fontSize], textAlign }]}>{children}</Text>;
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
});

export default Title;
