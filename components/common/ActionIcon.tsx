import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface ActionIconProps {
  icon: React.ReactElement;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

const ActionIcon = ({ icon, onPress, disabled, loading, label }: ActionIconProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        return [styles.innerContainer, pressed && styles.pressed];
      }}
    >
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {loading && <ActivityIndicator />}
        {!loading && icon}
        {!loading && label && <Text style={{ color: Colors.primary[500], fontSize: 13 }}>{label}</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  innerContainer: {
    paddingVertical: 3,
    paddingHorizontal: 3,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ActionIcon;
