import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Colors from '../../theme/colors';

const WritingAnimation = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length === 3) {
        setDots('');
      } else {
        setDots(dots + '.');
      }
    }, 300);

    return () => clearInterval(interval);
  }, [dots]);

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.gray[0] }}>{dots}</Text>
    </View>
  );
};

export default WritingAnimation;
