import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import { useRef } from 'react';

const OUTLINED_BUTTON_TEXT_COLOR = Colors.secondary[500];
const OUTLINED_BUTTON_BORDER_COLOR = Colors.secondary[500];

type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'gray'
  | 'green'
  | 'red'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'grape';

interface PrimaryButtonProps {
  children: React.ReactNode;
  type: 'primary' | 'outlined';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  rightIcon?: React.ReactNode;
  color?: ButtonColor;
}

const Button = (props: PrimaryButtonProps) => {
  const { children, onPress, loading, rightIcon, type, disabled, color } = props;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    let baseButtonStyle = [];
    if (type === 'outlined') {
      baseButtonStyle.push(styles.outlinedButton);
    } else if (type === 'primary') {
      baseButtonStyle.push(styles.primaryButton);
    }

    if (disabled) {
      baseButtonStyle = [...baseButtonStyle, styles.disabled];
    }
    if (color) {
      if (type === 'primary') {
        baseButtonStyle = [
          ...baseButtonStyle,
          {
            backgroundColor: Colors[color][500],
            borderColor: Colors[color][700],
          },
        ];
      }
      if (type === 'outlined') {
        baseButtonStyle = [
          ...baseButtonStyle,
          {
            borderColor: Colors[color][500],
            borderBottomColor: Colors[color][700],
            borderRightColor: Colors[color][700],
          },
        ];
      }
    }

    baseButtonStyle = [...baseButtonStyle, { transform: [{ scale: scaleAnim }] }];

    return baseButtonStyle;
  };

  const getTextStyle = () => {
    let baseTextStyle = [];
    if (type === 'outlined') {
      baseTextStyle.push(styles.outlinedButtonText);
    } else if (type === 'primary') {
      baseTextStyle.push(styles.primaryButtonText);
    }

    if (color) {
      if (type === 'outlined') {
        baseTextStyle = [
          ...baseTextStyle,
          {
            color: Colors[color][500],
          },
        ];
      }
    }

    if (disabled) {
      baseTextStyle = [...baseTextStyle, styles.disabled];
    }

    return baseTextStyle;
  };

  return (
    <Animated.View style={getButtonStyle()}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={loading || disabled}
      >
        <View style={styles.btnContent}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={getTextStyle()}>{children}</Text>
              {rightIcon}
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 20,
    borderBottomColor: Colors.primary[700],
    borderBottomWidth: 6,
    borderLeftColor: Colors.primary[500],
    borderLeftWidth: 6,
    borderRightColor: Colors.primary[700],
    borderRightWidth: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 45,
  },
  outlinedButton: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 12,
    borderColor: OUTLINED_BUTTON_BORDER_COLOR,
    borderBottomColor: Colors.secondary[700],
    borderBottomWidth: 6,
    borderRightColor: Colors.secondary[700],
    borderRightWidth: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'white',
  },
  outlinedButtonText: {
    color: OUTLINED_BUTTON_TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    backgroundColor: Colors.gray[400],
    borderColor: Colors.gray[500],
    color: 'white',
  },
});

export default Button;
