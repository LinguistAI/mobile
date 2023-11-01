import { SafeAreaView, View, Text } from "react-native";
// import { SettingsList } from "../components/settings/SettingsList";

const SettingsScreen = () => {
  // const { name } = useRoute();
  // const { t } = useTranslation();

  // const theme = useTheme();

  return (
    <SafeAreaView
      testID="settings-screen"
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "white",
      }}
    >
      <Text>Settings</Text>

      {/* <SettingsList /> */}
    </SafeAreaView>
  );
};
export default SettingsScreen;
