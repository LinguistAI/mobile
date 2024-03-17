import React from 'react';
import { View } from 'react-native';
import Colors from '../../theme/colors';

const Divider = () => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[500],
        width: '95%',
        alignSelf: 'center',
        marginVertical: 15,
      }}
    />
  );
};

export default Divider;
