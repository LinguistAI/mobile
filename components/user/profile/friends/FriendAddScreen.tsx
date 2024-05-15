import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SearchInput from '../../../common/SearchInput';
import { useLazySearchUserQuery } from '../../userApi';
import FriendsSearchList from './FriendsSearchList';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

const FriendAddScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [trigger, { data, isFetching }] = useLazySearchUserQuery();

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };
  const handleClearSearchText = () => {
    setSearchText('');
  };
  const handleSearch = () => {
    if (searchText === '') return;
    trigger({ username: searchText, page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE });
  };

  return (
    <View style={{ padding: 10 }}>
      <SearchInput
        onChangeText={handleSearchTextChange}
        onClear={handleClearSearchText}
        onSearch={handleSearch}
        searchText={searchText}
        placeholder="Type a username for searching..."
      />
      <View style={styles.searchResultsContainer}>
        <FriendsSearchList isLoading={isFetching} items={data?.content || []} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchResultsContainer: {
    marginTop: 15,
  },
});

export default FriendAddScreen;
