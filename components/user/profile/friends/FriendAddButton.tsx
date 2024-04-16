import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../../theme/colors';
import ActionIcon from '../../../common/ActionIcon';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FriendAddButton = () => {
  const navigation = useNavigation();

  const openAddFriendsScreen = () => {
    navigation.navigate('FriendAdd');
  };

  return (
    <View style={styles.addFriendContainer}>
      <ActionIcon
        icon={<Ionicons name="add-circle-sharp" size={24} color={Colors.primary[500]} />}
        onPress={openAddFriendsScreen}
      />
      <Text style={styles.addFriendText} onPress={openAddFriendsScreen}>
        Add new friend
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  addFriendContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFriendText: {
    color: Colors.primary[500],
  },
});

export default FriendAddButton;
