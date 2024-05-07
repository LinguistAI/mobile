import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, Text, View } from 'react-native';
import CenteredFeedback from '../../common/feedback/CenteredFeedback';
import StoreItemCard from './StoreItemCard';
import { useGetStoreItemsQuery, useGetTransactionQuery, useGetUserItemsQuery, usePurchaseItemMutation } from '../api';
import { IStoreItem, IStoreItemWithQuantity } from '../types';
import FetchError from '../../common/feedback/FetchError';
import LoadingIndicator from '../../common/feedback/LoadingIndicator';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { generateErrorResponseMessage } from '../../../utils/httpUtils';
import useNotifications from '../../../hooks/useNotifications';
import GemsIndicatorButton from '../../transaction/GemsIndicatorButton';
import { isDataResponse } from '../../../services';


const StoreItemsList = () => {
  const { data: storeItemsPage, isLoading: isStoreItemsLoading, isError: isStoreItemsError, refetch: storeItemsRefetch } = useGetStoreItemsQuery();
  const { data: userItemsPage, isLoading: isUserItemsLoading, isError: isUserItemsError, refetch: userItemsRefetch } = useGetUserItemsQuery();
  const { data: userGemsData, isLoading: isUserGemsLoading, isError: isUserGemsError, refetch: userGemsRefetch } = useGetTransactionQuery();
  const [purchase, { isError: isPurchaseError, error: purchaseError }] = usePurchaseItemMutation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { add } = useNotifications();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await storeItemsRefetch();
    await userItemsRefetch();
    await userGemsRefetch();
    setIsRefreshing(false);
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

  if (isStoreItemsError || isUserItemsError || isUserGemsError || !storeItemsPage || !userItemsPage || !userGemsData) {
    return <FetchError />;
  }

  if (!storeItemsPage?.storeItems || storeItemsPage?.storeItems?.length === 0) {
    return (
      <CenteredFeedback message="There are no items in the store" />
    );
  }

  const handleGemsPress = async (item: IStoreItemWithQuantity) => {
    const purchaseResponse  = await purchase({ itemId: item.id});
    if (purchaseError || isPurchaseError) {
      add({
        body: generateErrorResponseMessage(purchaseError),
        type: 'error',
      });
      return;
    }
    if (!isDataResponse(purchaseResponse)) return;
    add({ type: 'success', body: 'Item bought successfully.' });
    onRefresh();
  };

  const handleUserGemsPress = () => {
    // TODO purchasing gems
  };

  const renderItems = () => {
    // Merge store items with user items based on item id
    const mergedItems = storeItemsPage.storeItems.map(storeItem => {
      const userItem = userItemsPage.userItems.find(userItem => userItem.userItem.storeItem.id === storeItem.storeItem.id);
      return {
        ...storeItem.storeItem,
        quantityOwned: userItem ? userItem.userItem.quantity : 0
      };
    });
  
    return (
      <View style={styles.container}>
        <GemsIndicatorButton gemCount={userGemsData.gems} onClick={handleUserGemsPress} style={styles.gemsButton}/>
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

  return (
    <View style={{ flex: 1 }}>
      {renderItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20, 
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
  gemsButton: {
    justifyContent: 'flex-end',
    marginHorizontal: -15,
  },
});

export default StoreItemsList;
