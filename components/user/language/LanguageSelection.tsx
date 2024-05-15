import React from "react";
import {
  StyleSheet,
  View,
  Image,
} from "react-native";
import Colors from "../../../theme/colors";
import LText from "../../common/Text";

const LanguageSelection = ({ flag, isBeta, languageName, languageCode, isSelected }) => {
  return (
    <View style={[styles.container, isSelected && styles.selectedContainer]}>
      <Image source={flag} style={styles.flag} />
      <LText style={styles.languageName}>{languageName}</LText>
      {isBeta && <View style={styles.betaTextContainer}><LText style={styles.betaText}>BETA</LText></View>}
      {!isBeta && <View style={styles.releaseTextContainer}><LText style={styles.betaText}>VERSION 2</LText></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: Colors.gray[200],
    borderRadius: 5,
    width: 250,
    justifyContent: 'space-between',
  },
  flag: {
    width: 30,
    height: 20,
  },
  languageName: {
    flex: 1,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginLeft: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: Colors.primary[200],
    borderRadius: 5,
    width: 250,
    justifyContent: 'space-between',
  },
  betaTextContainer: {
    backgroundColor: Colors.red[700],
    borderRadius: 10,
    padding: 5,
  },
  releaseTextContainer: {
    backgroundColor: Colors.green[700],
    borderRadius: 10,
    padding: 5,
  },
  betaText: {
    color: Colors.gray[100],
    fontWeight: 'bold',
  },
  releaseText: {
    color: Colors.gray[100],
    fontWeight: 'bold',
  },
});

export default LanguageSelection;
