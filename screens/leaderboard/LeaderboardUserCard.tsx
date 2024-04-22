import { StyleSheet, Text, View, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFriendship, RLeaderboardUser } from '../../components/user/types';
import React from 'react';
import Card from '../../components/common/Card';
import Colors from '../../theme/colors';
import LText from '../../components/common/Text';

interface LeaderboardUserCardProps {
  leaderboardUser: RLeaderboardUser;
  loggedInUser: string;
}

const space = '   ';

const LeaderboardUserCard = ({ leaderboardUser, loggedInUser }: LeaderboardUserCardProps) => {
  const { user, experience: xp, ranking } = leaderboardUser;

  const renderRankingImage = () => {
    if (ranking === 1) {
      return require('../../assets/rank_icons/first.png');
    } else if (ranking === 2) {
      return require('../../assets/rank_icons/second.png');
    } else if (ranking === 3) {
      return require('../../assets/rank_icons/third.png');
    } else {
      return null;
    }
  };

  return (
    <Card
      style={
        user.username === loggedInUser
          ? { ...styles.highlightedCell, ...styles.contentRoot }
          : styles.contentRoot
      }
    >
      <View>
        <View style={styles.mainInfoContainer}>
          <View style={styles.mainInfoContainer}>
            {ranking <= 3 && <Image source={renderRankingImage()} style={styles.rankImage} />}
            {ranking > 3 && <LText style={styles.rankingInfo}>{ranking}.</LText>}

            <LText style={styles.mainInfo}>{user.username}</LText>
          </View>
          <LText style={styles.subinfo}>{xp} XP</LText>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentRoot: {
    padding: 10,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 0,

    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
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
  rankingInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.purple[500],
    marginLeft: 10,
    marginRight: 15,
  },
  mainInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.gray[700],
  },
  subinfo: {
    fontWeight: 'bold',
    color: Colors.yellow[400],
    fontSize: 14,
  },
  highlightedCell: {
    backgroundColor: '#F3E7FF',
  },
  rankImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default LeaderboardUserCard;
