import { ActivityIndicator } from 'react-native';
import Colors from '../../theme/colors';

const LoadingIndicator = () => {
  return (
    <ActivityIndicator
      size="large"
      color={Colors.primary[500]}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}
    />
  );
};

export default LoadingIndicator;
