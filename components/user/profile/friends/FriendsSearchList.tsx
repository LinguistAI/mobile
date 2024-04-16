import { FlatList, StyleSheet, View } from 'react-native';
import FriendSearchProfileCard from '../FriendSearchProfileCard';
import FriendProfileCard from './FriendProfileCard';
import { User } from '../../../../types';
import CardSkeleton from '../../../common/CardSkeleton';
import { RFriendSearch } from '../../types';

interface FriendsSearchListProps {
  isLoading: boolean;
  items: RFriendSearch[];
}

const FriendsSearchList = ({ items, isLoading }: FriendsSearchListProps) => {
  if (isLoading) {
    return <CardSkeleton count={6} />;
  }

  return (
    <View>
      <FlatList
        numColumns={1}
        data={items}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <FriendSearchProfileCard friendActions key={item.email} searchItem={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: 10,
  },
});

export default FriendsSearchList;
