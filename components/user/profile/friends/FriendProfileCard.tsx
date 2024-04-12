import { StyleSheet, Text, View } from 'react-native';
import { RFriendship } from '../../types';
import Card from '../../../common/Card';
import Colors from '../../../../theme/colors';

interface FriendProfileCardProps {
  friendship: RFriendship;
  isRequest?: boolean;
}

const FriendProfileCard = ({ friendship }: FriendProfileCardProps) => {
  const { user2: friend, date, status } = friendship;
  const renderRequestActions = () => {
    // TODO: Accept, reject
  };
  return (
    <Card>
      <View style={styles.contentRoot}>
        <View style={styles.infoContainer}>
          <Text style={styles.mainInfo}>{friend.username}</Text>
          <View style={styles.subInfoContainer}>
            <Text style={styles.subinfo}>{friend.email}</Text>
            <Text style={styles.subinfo}>{new Date(date).toLocaleString()}</Text>
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

export default FriendProfileCard;
