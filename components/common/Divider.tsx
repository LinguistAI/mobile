import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Colors from '../../theme/colors';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

const Divider = ({ style }: DividerProps) => {
  return (
    <View
      style={[
        {
          borderBottomWidth: 2,
          borderBottomColor: Colors.gray[500],
          width: '95%',
          alignSelf: 'center',
          marginVertical: 16,
        },
        style,
      ]}
    />
  );
};

export default Divider;
