import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import useUser from '../../../hooks/useUser';
import Avatar from '../../common/Avatar';

const ConversationsHeader = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar src={''} height={40} width={40} />
        </View>
        <Text style={styles.name}>{user.username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 60,
    borderBottomColor: Colors.primary[600],
    borderBottomWidth: 2,
    zIndex: 9999,
    backgroundColor: Colors.gray[0],
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConversationsHeader;
