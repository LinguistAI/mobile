import {ActivityIndicator, StyleSheet, View} from "react-native";
import Colors from "../../../theme/colors";
import React from "react";
import LText from "../../common/Text";

const ChangeLanguage = () => {
  return (
    <View style={styles.root}>
      <LText>ENG</LText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
    backgroundColor: Colors.gray[200],
    width: 70,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: Colors.gray[300],
  },
});

export default ChangeLanguage;
