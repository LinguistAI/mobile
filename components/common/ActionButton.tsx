import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';

interface ActionButtonProps {
  icon: React.ReactElement;
  onPress: () => void;
  title?: string | React.ReactElement;
  divider?: boolean;
  subText?: string;
  bgColor?: string;
  selectedBgColor?: string;
  borderColor?: string;
  selected?: boolean;
  maxWidth?: number;
  fontSize?: number;
}

const ActionButton = ({
  icon,
  onPress,
  title,
  subText,
  divider,
  bgColor,
  selectedBgColor,
  selected,
  maxWidth,
  borderColor,
}: ActionButtonProps) => {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => {
          return [
            styles.container,
            bgColor != null && { backgroundColor: bgColor },
            pressed && styles.pressed,
            selectedBgColor != null && selected && { backgroundColor: selectedBgColor },
            maxWidth != null && { maxWidth: maxWidth },
            borderColor != null && { borderColor: borderColor },
          ];
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.mainContentContainer}>
            {icon}
            <Text style={styles.title}>{title}</Text>
          </View>
          {divider && <View style={styles.divider} />}
          {subText && (
            <View>
              <Text style={styles.subText}>{subText}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 2, // Add border
    borderColor: Colors.primary['600'], // Set border color
    maxWidth: 250,
  },
  mainContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.gray['600'],
    marginVertical: 5,
  },
  title: {
    fontSize: 16,
    color: Colors.primary['500'],
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ActionButton;
