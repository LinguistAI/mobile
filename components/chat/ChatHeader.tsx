import { useSelector } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/colors';
import Avatar from '../common/Avatar';
import { useNavigation } from '@react-navigation/native';
import ActionIcon from '../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { selectCurrentBot } from '../../redux/chatSelectors';

const ChatHeader = () => {
  const currentBot = useSelector(selectCurrentBot);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <ActionIcon icon={<Ionicons size={28} name="arrow-back" />} onPress={handleGoBack} />
          <Avatar src={currentBot?.profileImage} height={40} width={40} />
        </View>
        <Text style={styles.botName}>{currentBot?.name}</Text>
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
  botName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatHeader;
