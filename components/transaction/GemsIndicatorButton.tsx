import {StyleSheet, View, Image} from 'react-native';
import Colors from '../../theme/colors';
import LText from '../common/Text';
import React from "react";
import ActionButton from "../common/ActionButton";

interface GemsIndicatorProps {
  gemCount: number;
  onClick: () => void;
}

const GemsIndicatorButton = ({ gemCount, onClick }: GemsIndicatorProps) => {
  return (
    <View style={styles.root}>
      <ActionButton
        bgColor={Colors.primary[500]}
        onPress={onClick}
        marginTop={-15}
        marginBottom={-15}
        title={
          <View style={styles.root}>
            <LText style={styles.gems}>{gemCount}</LText>
            <Image
              source={require('../../assets/gem1.png')}
              style={styles.image}
            />
          </View>
        }
        icon={
          <></>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
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

export default GemsIndicatorButton;
