import { useFonts } from 'expo-font';
import { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { FontLoadedContext } from '../../App';
import TitleSizes from '../../theme/fontSizes';

type FontSizeKeys = keyof typeof TitleSizes;

interface TitleProps {
  children: React.ReactNode;
  size?: FontSizeKeys;
  centered?: boolean;
}

const Title = ({ children, size: fontSize = 'h1', centered }: TitleProps) => {
  const textAlign = centered ? 'center' : 'left';
  const fontsLoaded = useContext(FontLoadedContext);
  let currentStyle = styles.titleTextCustom;

  if (!fontsLoaded) {
    currentStyle = styles.titleText; // Return null if fonts are not yet loaded
  }

  // const [fontsLoaded] = useFonts({
  //   Nunito: require('../../assets/fonts/Nunito-Regular.ttf'),
  // });

  // console.log(fontsLoaded);

  // if (!fontsLoaded) {
  //   return null;
  // }

  // console.log('alo ', fontsLoaded);

  return <Text style={[currentStyle, { fontSize: TitleSizes[fontSize], textAlign }]}>{children}</Text>;
};

const styles = StyleSheet.create({
  titleTextCustom: {
    fontSize: 24,
    // fontWeight: 'bold',
    fontFamily: 'NunitoBolder',
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
