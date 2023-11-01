import * as React from "react";
// import { useTranslation } from "react-i18next";
import {
  Linking,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Text,
} from "react-native";

// import { BackIcon } from "../SVG/BackIcon";
// import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

interface Props {
  item: string;
  isFirstElement?: boolean;
  isLastElement?: boolean;
}

const SettingsListItem = (props: Props) => {
  //   const { t } = useTranslation();

  return (
    <TouchableNativeFeedback onPress={() => actionForMenuItem(props.item)}>
      <View
        style={styles.settingListItem}
        {...props}
        //   activeOpacity={1}
      >
        {/* <Text numberOfLines={1}>{t(`menuItem.${props.item}`)}</Text> */}
        <Text numberOfLines={1}>{props.item}</Text>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            {/* {props.item === "theme" && <ThemeSwitch />} */}

            {/* {props.item !== "theme" && <BackIcon color="grey" fill="none" />} */}
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const actionForMenuItem = (item: string) => {
  switch (item) {
    case "aboutMe": {
      Linking.openURL("");
      break;
    }
    case "help": {
      Linking.openURL("");
    }
    case "spaceAPI": {
      Linking.openURL("");
    }
    case "review": {
    }
  }
};

const styles = StyleSheet.create({
  settingListItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default SettingsListItem;
