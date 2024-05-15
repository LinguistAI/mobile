import React from "react";
import {
  StyleSheet,
  View,
  Image,
} from "react-native";
import Colors from "../../../theme/colors";
import LText from "../../common/Text";

const LanguageSelection = ({ flag, isBeta, languageName, languageCode }) => {
  return (
    <View style={styles.container}>
      <Image source={flag} style={styles.flag} />
      <LText style={styles.languageName}>{languageName}</LText>
      {isBeta && <LText style={styles.betaText}>BETA</LText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: Colors.gray[300],
    borderRadius: 5,
    width: 250,
    justifyContent: 'space-between',
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  languageName: {
    flex: 1,
    fontWeight: 'bold',
  },
  betaText: {
    color: Colors.red[500],
    fontWeight: 'bold',
  },
});

export default LanguageSelection;
