import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGetFriendsQuery } from '../../userApi';

const FriendsList = () => {
  const { data: friends, isLoading, isError } = useGetFriendsQuery();
  console.log(friends);

  return (
    <ScrollView style={styles.root}>
      <View></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default FriendsList;
