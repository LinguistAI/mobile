import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import StoreItemCard from './StoreItemCard';
import {
  useGetStoreItemsQuery,
  useGetUserItemsQuery,
  usePurchaseItemMutation,
} from '../api';
import { IStoreItemWithQuantity } from '../types';
import FetchError from '../../common/feedback/FetchError';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import useNotifications from '../../../hooks/useNotifications';
import useError from '../../../hooks/useError';
import { isDataResponse } from '../../../services';

const StoreItemsList = () => {
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
  
  const [purchase, { isError: isPurchaseError, error: purchaseError }] = usePurchaseItemMutation();
  useError(purchaseError);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { add } = useNotifications();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await storeItemsRefetch();
    await userItemsRefetch();
    setIsRefreshing(false);
  }, [storeItemsRefetch, userItemsRefetch]);

  const renderSkeletonList = () => {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <ShimmerPlaceholder key={index} style={styles.skeletonRectangle} LinearGradient={LinearGradient} />
        ))}
      </View>
    );
  };

  if (isStoreItemsLoading || isUserItemsLoading) return renderSkeletonList();

  if (
    isStoreItemsError ||
    isUserItemsError ||
    !storeItemsPage ||
    !userItemsPage 
  ) {
    return <FetchError />;
  }

  if (!storeItemsPage?.storeItems || storeItemsPage?.storeItems?.length === 0) {
    return <CenteredFeedback message="There are no items in the store" />;
  }

  const handleGemsPress = async (item: IStoreItemWithQuantity) => {
    const purchaseResponse = await purchase({ itemId: item.id });
    if (purchaseError || isPurchaseError || !isDataResponse(purchaseResponse)) {
      return;
    }
    add({ type: 'success', body: 'Item bought successfully.' });
    onRefresh();
  };

  const renderItems = () => {
    // Merge store items with user items based on item id
    const mergedItems = storeItemsPage.storeItems.map((storeItem) => {
      const userItem = userItemsPage.userItems.find(
        (userItem) => userItem.userItem.storeItem.id === storeItem.storeItem.id
      );
      return {
        ...storeItem.storeItem,
        quantityOwned: userItem ? userItem.userItem.quantity : 0,
      };
    });

    return (
      <View style={styles.container}>
        <FlatList
          data={mergedItems}
          renderItem={({ item }) => (
            <StoreItemCard storeItem={item} onGemsPress={() => handleGemsPress(item)} />
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
          style={styles.storeItemsContainer}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
      </View>
    );
  };

  return <View style={{ flex: 1 }}>{renderItems()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  storeItemsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemContentContainer: {
    flexGrow: 1,
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonRectangle: {
    width: '48%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default StoreItemsList;
