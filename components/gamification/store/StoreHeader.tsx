import React from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import GemsIndicatorButton from '../transaction/GemsIndicatorButton';
import { RUserGems } from '../types';

interface StoreHeaderProps {
  userGemsData: RUserGems;
  isUserGemsLoading: boolean;
  isRefreshing: boolean;
  onRefresh:  () => Promise<void>;
}

const StoreHeader = ({ userGemsData, isUserGemsLoading, isRefreshing, onRefresh }: StoreHeaderProps) => {

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
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
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
