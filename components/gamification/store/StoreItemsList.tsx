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


const StoreItemsList = () => {
  const { data: storeItemsPage, isLoading: isStoreItemsLoading, isError: isStoreItemsError, refetch: storeItemsRefetch } = useGetStoreItemsQuery();
  const { data: userItemsPage, isLoading: isUserItemsLoading, isError: isUserItemsError, refetch: userItemsRefetch } = useGetUserItemsQuery();
  const { data: userGemsData, isLoading: isUserGemsLoading, isError: isUserGemsError, refetch: userGemsRefetch } = useGetTransactionQuery();
  const [purchase, { isError: isPurchaseError, error }] = usePurchaseItemMutation();
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
    console.log(`Gems button pressed for item: ${item.id}`);
    await purchase({ itemId: item.id});
    if (error || isPurchaseError) {
      add({
        body: generateErrorResponseMessage(error),
        type: 'error',
      });
      return;
    }
    else{onRefresh();}
  };

  const renderItems = () => {
    // Merge store items with user items based on item id
    const mergedItems: IStoreItemWithQuantity[] = storeItemsPage.storeItems.map(storeItem => {
      const userItem = userItemsPage.userItems.find(userItem => userItem.userItem.storeItem.id === storeItem.storeItem.id);
      return {
        ...storeItem.storeItem, // Adjusted to access the storeItem object
        quantityOwned: userItem ? userItem.userItem.quantity : 0
      };
    });
  
     // Render user gems on top of the FlatList
    const renderUserGems = () => (
      <View style={styles.userGemsContainer}>
        <Text style={styles.userGemsText}>{`User Gems: ${userGemsData.gems}`}</Text>
      </View>
    );

    return (
      <View style={styles.storeItemsContainer}>
        {renderUserGems()}
        <FlatList
          data={mergedItems}
          renderItem={({ item }) => (
            <StoreItemCard storeItem={item} onGemsPress={() => handleGemsPress(item)} />
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
          style={styles.itemContentContainer}
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
  },
  storeItemsContainer: {
    flex: 8,
    paddingHorizontal: 10, // Add horizontal padding
    paddingBottom: 20, 
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
  userGemsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff', // Background color for the user gems container
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Border color for the user gems container
  },
  userGemsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Text color for the user gems
  },
});

export default StoreItemsList;
