import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/form/Button';
import Title from '../../components/common/Title';
import { checkAuth } from '../../services/auth';
import Colors from '../../theme/colors';
import useUser from '../../hooks/useUser';
import Splash from '../../components/common/feedback/Splash';

interface LandingScreenProps {
  navigation: any;
}

const LandingScreen = (props: LandingScreenProps) => {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { updateLoginTime } = useUser();
  const { mutate: checkAuthMutate } = useMutation({
    mutationKey: ['checkAuth'],
    mutationFn: () => checkAuth(),
    onSuccess: (res) => {
      console.log('Success auth');

      updateLoginTime();
      setCheckingAuth(false);
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main', screen: 'Profile' }],
      });
    },
    onError: (error: any) => {
      console.log('Fail auth');

      setCheckingAuth(false);
    },
  });

  useEffect(() => {
    console.log('Checking auth');
    checkAuthMutate();
  }, []);

  if (checkingAuth) {
    return <Splash />;
  }

  const navigateLogin = () => {
    props.navigation.navigate('Login');
  };
  const navigateRegister = () => {
    props.navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Linguist</Text>
      </View>
      <View style={styles.landingSection}>
        <View>
          <Title centered size="h2">
            Regular here?
          </Title>
          <Text style={styles.sectionDescription}>Get back on your path!</Text>
        </View>
        <View style={styles.sectionButton}>
          <Button type="primary" onPress={navigateLogin}>
            LOG IN
          </Button>
        </View>
      </View>
      <View>
        <View
          style={[
            styles.landingSection,
            {
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
        />
      </View>
      <View style={styles.landingSection}>
        <View>
          <Title centered size="h2">
            Just coming in?
          </Title>
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
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  container: {
    flex: 1,
    marginVertical: 32,
    padding: 20,
  },
  landingSection: {
    flex: 5,
    justifyContent: 'center',
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 6,
    textAlign: 'center',
    color: Colors.gray[900],
  },
  sectionButton: {
    marginTop: 18,
  },
});

export default LandingScreen;
