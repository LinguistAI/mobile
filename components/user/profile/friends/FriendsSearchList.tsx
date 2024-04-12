import { FlatList, StyleSheet, View } from 'react-native';
import UserProfileCard from '../UserProfileCard';
import FriendProfileCard from './FriendProfileCard';
import { User } from '../../../../types';

interface FriendsSearchListProps {
  isLoading: boolean;
  items: User[];
}

const FriendsSearchList = ({ items, isLoading }: FriendsSearchListProps) => {
  const renderSkeleton = () => {
    return null;
  };

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <View>
      <FlatList
        numColumns={1}
        data={items}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <UserProfileCard friendActions key={item.email} user={item} />}
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
