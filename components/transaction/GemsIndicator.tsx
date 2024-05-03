import {StyleSheet, View, Image} from 'react-native';
import Colors from '../../theme/colors';
import LText from '../common/Text';
import React from "react";

interface GemsIndicatorProps {
  gemCount: number;
}

const GemsIndicator = ({ gemCount }: GemsIndicatorProps) => {
  return (
    <View style={styles.root}>
      <LText style={styles.gems}>{gemCount}</LText>
      <Image
        source={require('../../assets/gem1.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginLeft: 120,
    marginRight: 120,
    padding: 5,
    borderRadius: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
  },
  image: {
    width: 40,
    height: 40,
    marginRight: -5,
  },
  text: {
    fontSize: 20,
    color: Colors.gray[100],
  },
  gems: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.gray[100],
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0.5, height: 2 },
    textShadowRadius: 1,
    marginRight: 2,
  }
});

export default GemsIndicator;
