import { Ionicons } from '@expo/vector-icons';
import ActionIcon from '../common/ActionIcon';
import Colors from '../../theme/colors';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { formatTime } from '../utils';

interface RefetchButtonProps {
  onPress: () => void;
  lastUpdate: Date;
  style?: StyleProp<ViewStyle>;
}

const RefetchButton = ({ onPress, lastUpdate, style }: RefetchButtonProps) => {
  return (
    <View style={[style, { paddingHorizontal: 6 }]}>
      <ActionIcon
        onPress={onPress}
        icon={<Ionicons name="refresh-sharp" color={Colors.primary[500]} size={18} />}
        label={`Last update at ${formatTime(lastUpdate)}`}
      />
    </View>
  );
};

export default RefetchButton;
