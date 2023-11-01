import * as React from "react";
import { StyleSheet, View, Text } from "react-native";

interface Props {
  icon: JSX.Element;
  title: string;
}

export const SettingsListSectionHeader = (props: Props) => {
  const { icon, title } = props;

  return (
    <View style={styles.view}>
      {icon}

      <Text style={{ marginLeft: 16 }}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 32,
    marginBottom: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
});
