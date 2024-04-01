import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  subtext?: string;
}

const LoadingIndicator = ({ size = 'large', subtext = '' }: LoadingIndicatorProps) => {
  return (
    <View style={styles.root}>
      <ActivityIndicator size={size} color={Colors.primary[500]} style={styles.indicator} />
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  indicator: {
    alignSelf: 'center',
  },
  subtext: {
    fontSize: 13,
    color: Colors.gray[700],
  },
});

export default LoadingIndicator;
