import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../form/Button';

interface FetchErrorProps {
  withNavigation?: boolean;
}

const FetchError = ({ withNavigation = true }: FetchErrorProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <Ionicons name="alert-circle" size={40} color="red" />
      <Text style={styles.text}>We have issues accessing our servers. Thanks for being patient with us!</Text>
      {withNavigation ? (
        <View>
          <Button type="outlined" color="grape" onPress={() => navigation.goBack()}>
            Take me where I came from!
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default FetchError;
