import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import StoreItemCard from './StoreItemCard';
import {
  usePurchaseItemMutation,
} from '../api';
import { IStoreItemWithQuantity, RStoreItemsPage, RUserItemsPage } from '../types';
import useNotifications from '../../../hooks/useNotifications';
import useError from '../../../hooks/useError';
import { isDataResponse } from '../../../services';
import Colors from "../../../theme/colors";
import { useEffect, useState } from 'react';

interface StoreItemsListProps {
  storeItemsPage: RStoreItemsPage;
  userItemsPage: RUserItemsPage;
  isRefreshing: boolean;
  onRefresh:  () => Promise<void>;
}

const StoreItemsList  = ({ storeItemsPage, userItemsPage, isRefreshing, onRefresh }: StoreItemsListProps) => {
  const [purchase, { isError: isPurchaseError, error: purchaseError }] = usePurchaseItemMutation();
  useError(purchaseError);

  const [purchasingItemId, setPurchasingItemId] = useState('');

  const { add, remove, clear } = useNotifications();

  const handleGemsPress = async (item: IStoreItemWithQuantity) => {
    clear();

    const purchasingNotificationId = add({ type: 'info', body: 'Purchasing...', time: 5000 });
    setPurchasingItemId(item.id);

    const purchaseResponse = await purchase({ itemId: item.id });
    if (purchaseError || isPurchaseError || !isDataResponse(purchaseResponse)) {
      setPurchasingItemId('');
      return;
    }

    remove(purchasingNotificationId);
    setPurchasingItemId('');
    add({ type: 'success', body: `Purchased '${item.type}'.`, time: 2500 });
    await onRefresh();
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
      <ScrollView style={styles.container}>
        <FlatList
          data={mergedItems}
          renderItem={({ item }) => {
            if ( item.id !== purchasingItemId ) {
              return (
                <StoreItemCard gemDisplay={item.price} storeItem={item} onGemsPress={() => handleGemsPress(item)} purchasing={false} />
              );
            }

            // if the item is being purchased
            return (
              <StoreItemCard gemDisplay={item.price} storeItem={item} onGemsPress={() => handleGemsPress(item)} purchasing={true} />
            )
          }}
          numColumns={2}
          keyExtractor={(item) => item.id}
          style={styles.storeItemsContainer}
        />
      </ScrollView>
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
