import StoreItemsList from './StoreItemsList';
import StoreHeader from './StoreHeader';
import React, { useCallback, useState } from 'react';
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
import LText from '../../common/Text';
import Title from '../../common/Title';
import Divider from '../../common/Divider';

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
      <ScrollView>
        <Title style={styles.subtitle} size="h4">Consumables</Title>
        <StoreItemsList
          storeItemsPage={storeItemsPage}
          userItemsPage={userItemsPage}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
        <Divider />
        <Title style={styles.subtitle} size="h4">Cosmetics</Title>
        <LText style={styles.comingSoon} size={20} centered={true}>Coming soon...</LText>
        <Divider />
        <Title style={styles.subtitle} size="h4">Themes</Title>
        <LText style={styles.comingSoon} size={20} centered={true}>Coming soon...</LText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 24,
    fontFamily: 'Bold',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  comingSoon: {
    marginBottom: 30,
    fontSize: 24,
    paddingHorizontal: 16,
    marginVertical: 4,
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
