import { SafeAreaView, Text, View } from "react-native";
import { SettingsList } from "../../components/common/settings/SettingsList";

const SettingsScreenFake = () => {
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

      <SettingsList />
    </SafeAreaView>
  );
};
export default SettingsScreenFake;
