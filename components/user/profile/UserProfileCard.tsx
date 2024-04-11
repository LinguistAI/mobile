import { StyleSheet, Text, View } from 'react-native';
import Card from '../../common/Card';
import Colors from '../../../theme/colors';

interface UserProfileCardProps {
  user: User;
  friendActions?: boolean;
}

const UserProfileCard = ({ user, friendActions }: UserProfileCardProps) => {
  const renderFriendActions = () => {
    if (!friendActions) return null;
  };
  return (
    <Card>
      <View style={styles.contentRoot}>
        <View style={styles.infoContainer}>
          <Text style={styles.mainInfo}>{user.username}</Text>
          <View style={styles.subInfoContainer}>
            <Text style={styles.subinfo}>{user.email}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentRoot: {
    padding: 10,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  subInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  subinfo: {
    color: Colors.gray[500],
    fontSize: 13,
  },
});

export default UserProfileCard;
