import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import StoreItemCard from './StoreItemCard';
import {
  usePurchaseItemMutation,
} from '../api';
import { IStoreItemWithQuantity, RStoreItemsPage, RUserItemsPage } from '../types';
import useNotifications from '../../../hooks/useNotifications';
import useError from '../../../hooks/useError';
import { isDataResponse } from '../../../services';

interface StoreItemsListProps {
  storeItemsPage: RStoreItemsPage;
  userItemsPage: RUserItemsPage; 
  isRefreshing: boolean;
  onRefresh:  () => Promise<void>;
}

const StoreItemsList  = ({ storeItemsPage, userItemsPage, isRefreshing, onRefresh }: StoreItemsListProps) => {
  const [purchase, { isError: isPurchaseError, error: purchaseError }] = usePurchaseItemMutation();
  useError(purchaseError);

  const { add } = useNotifications();

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
});

export default StoreItemsList;
