import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import React from 'react';
import LText from '../../common/Text';
import Colors from '../../../theme/colors';

interface GemsIndicatorProps {
  gemCount: number | null;
  loading?: boolean;
}

const GemsIndicator = ({ gemCount, loading }: GemsIndicatorProps) => {
  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator size={40} color={Colors.gray[0]} />
      ) : (
        <LText style={styles.gems}>{gemCount ?? 0}</LText>
      )}
      <Image source={require('../../assets/gem1.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
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
  },
});

export default GemsIndicator;
