import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import LText from '../Text';

interface CenteredFeedbackProps {
  message: string;
  children?: React.ReactNode;
  size?: number;
}

const CenteredFeedback = ({ message, children, size = 30 }: CenteredFeedbackProps) => {
  return (
    <View style={styles.root}>
      <LText style={styles.message} size={size} centered={true}>
        {message}
      </LText>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: Colors.gray[900],
    padding: 20,
    textAlign: 'center',
  },
});

export default CenteredFeedback;
