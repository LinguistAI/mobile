import * as React from "react";
import { SectionList, View, StyleSheet } from "react-native";

import IonIcons from "@expo/vector-icons/Ionicons";

import SettingsListItem from "./SettingsListItem";
import { SettingsListSectionHeader } from "./SettingsListSectionHeader";

const settingsData: {
  title: string;
  icon: JSX.Element;
  data: string[];
}[] = [
  {
    title: "About",
    icon: <IonIcons name="gift-outline" size={16} padding={8} />,
    data: ["aboutMe", "spaceAPI", "theme"],
  },
  {
    title: "Feedback and Help",
    icon: <IonIcons name="mail-outline" size={16} padding={8} />,
    data: ["help", "review"],
  },
];

export const SettingsList = () => {
  return (
    <SectionList
      sections={settingsData}
      style={{ flex: 1, width: "100%", marginTop: 24 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={() => <View style={styles.searchItemSeperator} />}
      keyExtractor={(it) => it}
      renderItem={(props) => {
        const isFirstElement = props.index === 0;
        const isLastElement = props.index === props.section.data.length - 1;

        return (
          <SettingsListItem
            item={props.item}
            isFirstElement={isFirstElement}
            isLastElement={isLastElement}
          />
        );
      }}
      renderSectionHeader={({ section: { title, icon } }) => (
        <SettingsListSectionHeader icon={icon} title={title} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  searchItemSeperator: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
});
