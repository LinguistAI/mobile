import StoreItemsList from './StoreItemsList';
import StoreHeader from './StoreHeader';
import { useCallback, useState } from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import {
  useGetStoreItemsQuery,
  useGetTransactionQuery,
  useGetUserItemsQuery,
} from '../api';
import FetchError from '../../common/feedback/FetchError';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const StoreWrapper = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    data: storeItemsPage,
    isLoading: isStoreItemsLoading,
    isError: isStoreItemsError,
    refetch: storeItemsRefetch,
  } = useGetStoreItemsQuery();

  const {
    data: userItemsPage,
    isLoading: isUserItemsLoading,
    isError: isUserItemsError,
    refetch: userItemsRefetch,
  } = useGetUserItemsQuery();

  const {
    data: userGemsData,
    isLoading: isUserGemsLoading,
    isError: isUserGemsError,
    refetch: userGemsRefetch,
  } = useGetTransactionQuery();

  const onRefresh = useCallback(async () => {
    await storeItemsRefetch();
    await userItemsRefetch();
    await userGemsRefetch();
  }, [storeItemsRefetch, userItemsRefetch, userGemsRefetch]);

  const renderSkeletonList = () => {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerPlaceholder key={index} style={styles.skeletonRectangle} LinearGradient={LinearGradient} />
        ))}
      </View>
    );
  };

  if (isStoreItemsLoading || isUserItemsLoading || isUserGemsLoading) return renderSkeletonList();

  if (
    isStoreItemsError ||
    isUserItemsError ||
    isUserGemsError ||
    !storeItemsPage ||
    !userItemsPage ||
    !userGemsData
  ) {
    return <FetchError />;
  }

  if (!storeItemsPage?.storeItems || storeItemsPage?.storeItems?.length === 0) {
    return <CenteredFeedback message="There are no items in the store" />;
  }

  return (
    <View style={styles.root}>
      <StoreHeader
        userGemsData={userGemsData}
        isUserGemsLoading={isUserGemsLoading}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
      />
      <StoreItemsList
        storeItemsPage={storeItemsPage}
        userItemsPage={userItemsPage}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonRectangle: {
    width: '40%',
    height: 250,
    borderRadius: 20,
    marginHorizontal: 15,
    marginVertical: 15,
  },
});

export default StoreWrapper;
