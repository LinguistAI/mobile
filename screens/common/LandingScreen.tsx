import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/form/Button";
import SecondaryButton from "../../components/common/form/SecondaryButton";
import Title from "../../components/common/Title";
import useNotifications from "../../hooks/useNotifications";
import { checkAuth } from "../../services/auth";
import Colors from "../../theme/colors";
import useUser from "../../hooks/useUser";

interface LandingScreenProps {
  navigation: any;
}

const LandingScreen = (props: LandingScreenProps) => {
  const { updateLoginTime } = useUser();
  const { mutate: checkAuthMutate } = useMutation({
    mutationKey: ["checkAuth"],
    mutationFn: () => checkAuth(),
    onSuccess: (res) => {
      updateLoginTime();
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Main", screen: "Profile" }],
      });
    },

    onError: (error: any) => {
      console.log("Error contuining auth");
      console.log(error);
    },
  });

  useEffect(() => {
    checkAuthMutate();
  }, []);

  const navigateLogin = () => {
    props.navigation.navigate("Login");
  };
  const navigateRegister = () => {
    props.navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Linguist AI</Text>
      </View>
      <View style={styles.landingSection}>
        <View>
          <Title fontSize="h2">Regular here?</Title>
          <Text style={styles.sectionDescription}>Get back on your path!</Text>
        </View>
        <View style={styles.sectionButton}>
          <Button type="primary" onPress={navigateLogin}>LOG IN</Button>
        </View>
      </View>
      <View>
        <View
          style={[
            styles.landingSection,
            {
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
        />
      </View>
      <View style={styles.landingSection}>
        <View>
          <Title fontSize="h2">Just coming in?</Title>
          <Text style={styles.sectionDescription}>Start your journey now.</Text>
        </View>
        <View style={styles.sectionButton}>
          <Button type="outlined" onPress={navigateRegister}>
            CREATE AN ACCOUNT
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary[500],
  },
  container: {
    flex: 1,
    marginVertical: 32,
    padding: 20,
  },
  landingSection: {
    flex: 5,
    justifyContent: "center",
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 6,
    textAlign: "center",
  },
  sectionButton: {
    marginTop: 18,
  },
});

export default LandingScreen;
