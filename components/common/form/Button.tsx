import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import { useRef } from 'react';

const OUTLINED_BUTTON_TEXT_COLOR = Colors.primary[500];
const OUTLINED_BUTTON_BORDER_COLOR = Colors.primary[500];

interface PrimaryButtonProps {
  children: React.ReactNode;
  type: 'primary' | 'outlined';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  rightIcon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

const Button = (props: PrimaryButtonProps) => {
  const { children, onPress, loading, rightIcon, type, bgColor, borderColor, textColor, disabled } = props;
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
    if (bgColor) {
      baseButtonStyle = [...baseButtonStyle, { borderColor, backgroundColor: bgColor }];
    }
    if (disabled) {
      baseButtonStyle = [...baseButtonStyle, styles.disabled];
    }

    baseButtonStyle = [...baseButtonStyle, { transform: [{ scale: scaleAnim }] }];

    return baseButtonStyle;
  };

  const getTextStyle = () => {
    let baseTextStyle = [];
    if (type === 'outlined') {
      baseTextStyle.push(styles.outlinedButtonText);
      if (textColor) {
        baseTextStyle = [...baseTextStyle, { color: textColor }];
      }
    } else if (type === 'primary') {
      baseTextStyle.push(styles.primaryButtonText);
    }

    if (disabled) {
      baseTextStyle = [...baseTextStyle, styles.disabled];
    }

    return baseTextStyle;
  };

  return (
    <Animated.View style={getButtonStyle()}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} disabled={loading || disabled}>
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
    borderRadius: 4,
    borderBottomColor: Colors.primary[700],
    borderBottomWidth: 6,
    borderRightColor: Colors.primary[700],
    borderRightWidth: 6,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
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
    minHeight: 40,
  },
  outlinedButton: {
    borderRadius: 4,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 12,
    borderColor: OUTLINED_BUTTON_BORDER_COLOR,
    borderBottomColor: Colors.primary[700],
    borderBottomWidth: 6,
    borderRightColor: Colors.primary[700],
    borderRightWidth: 6,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
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
