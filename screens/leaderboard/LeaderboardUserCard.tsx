import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFriendship, RLeaderboardUser } from '../../components/user/types';
import React from 'react';
import Card from '../../components/common/Card';
import Colors from '../../theme/colors';
import { User } from '../../types';

interface LeaderboardUserCardProps {
  leaderboardUser: RLeaderboardUser;
  loggedInUser: string;
}

const LeaderboardUserCard = ({ leaderboardUser, loggedInUser }: LeaderboardUserCardProps) => {
  const { user, experience: xp, ranking } = leaderboardUser;

  return (
    <Card style={user.username === loggedInUser ? styles.highlightedCell : styles.contentRoot}>
      <View>
        <View style={styles.mainInfoContainer}>
          <Text style={styles.mainInfo}>{ranking}. </Text>

          <Text style={styles.mainInfo}>{user.username}</Text>
          <Text style={styles.mainInfo}>{xp}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentRoot: {
    padding: 10,
    alignSelf: 'center',
    width: '96%',
    borderRadius: 0,
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
  mainInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  highlightedCell: {
    padding: 10,
    alignSelf: 'center',
    width: '96%',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default LeaderboardUserCard;
