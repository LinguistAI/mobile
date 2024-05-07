import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import { useGetTransactionQuery } from '../api';
import { useCallback, useState } from 'react';
import GemsIndicatorButton from '../transaction/GemsIndicatorButton';
import FetchError from '../../common/feedback/FetchError';

const StoreHeader = () => {

    const {
        data: userGemsData,
        isLoading: isUserGemsLoading,
        isError: isUserGemsError,
        refetch: userGemsRefetch,
    } = useGetTransactionQuery();
    
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await userGemsRefetch();
        setIsRefreshing(false);
    }, [userGemsRefetch]);

    if (
      isUserGemsError ||
      !userGemsData
    ) {
    return <FetchError />;
    }

    const handleUserGemsPress = () => {
      // TODO purchasing gems
      onRefresh();
    };

    return (
        <View style={styles.root}>
          <View style={styles.container}>
              <Text style={styles.storeLabel}>Store</Text>
              <View style={styles.rightContainer}>
                  <Text style={styles.youHaveLabel}>You have </Text>
                  <View style={styles.gemsButtonContainer}>
                      <GemsIndicatorButton
                          gemCount={userGemsData.gems}
                          onClick={handleUserGemsPress}
                          loading={isUserGemsLoading}
                      />
                  </View>
              </View>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
  root: {
    height: 60,
    borderBottomColor: Colors.primary[500],
    borderBottomWidth: 2,
    zIndex: 9999,
    backgroundColor: Colors.gray[0],
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  storeLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gemsButtonContainer: {
    marginLeft: 'auto', 
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  youHaveLabel: {
    marginRight: 5,
    fontSize: 16,
  },
});

export default StoreHeader;
