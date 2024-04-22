import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLazyGetGlobalLeaderboardQuery } from '../../components/user/userApi';
import LeaderboardList from './LeaderboardList';
import LText from '../../components/common/Text';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

const GlobalLeaderboardScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trigger, { data: leaderboard, isFetching, isError }] = useLazyGetGlobalLeaderboardQuery();

  const currentPage = leaderboard?.currentPage || DEFAULT_PAGE;
  const totalPageNum = leaderboard?.totalPages || 0;

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      trigger({ size: DEFAULT_PAGE_SIZE, page: currentPage - 1 });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPageNum - 1) {
      trigger({ size: DEFAULT_PAGE_SIZE, page: currentPage + 1 });
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await trigger({ size: DEFAULT_PAGE_SIZE, page: currentPage });
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    trigger({ size: DEFAULT_PAGE_SIZE });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, display: 'flex', backgroundColor: 'white' }}>
      {totalPageNum > 1 ? (
        <View style={styles.pageButtons}>
          <TouchableOpacity onPress={goToPreviousPage} disabled={currentPage === 0}>
            <Ionicons
              name="chevron-back-circle-outline"
              size={32}
              color={currentPage === 0 ? 'gray' : 'black'}
            />
          </TouchableOpacity>
          <LText style={{ fontSize: 17 }} marginHorizontal={15}>
            {currentPage + 1}
          </LText>
          <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPageNum - 1}>
            <Ionicons
              name="chevron-forward-circle-outline"
              size={32}
              color={currentPage === totalPageNum - 1 ? 'gray' : 'black'}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      <LeaderboardList
        data={leaderboard}
        message="Looks like you have no friends just yet. Send a friend request to meet with new people!"
        isDataLoading={isFetching}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  friendAddBtnContainer: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  pageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    width: '99%',
    alignSelf: 'center',
    marginTop: 15,
  },
});
export default GlobalLeaderboardScreen;
