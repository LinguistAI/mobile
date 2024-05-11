import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Colors from '../../../theme/colors';
import GemsIndicatorButton from '../transaction/GemsIndicatorButton';
import useNotifications from '../../../hooks/useNotifications';
import { RUserGems } from '../types';
import GemsIndicator from "../transaction/GemsIndicator";


interface StoreHeaderProps {
  userGemsData: RUserGems;
  isUserGemsLoading: boolean;
  isRefreshing: boolean;
  onRefresh:  () => Promise<void>;
}

const StoreHeader = ({ userGemsData, isUserGemsLoading, isRefreshing, onRefresh }: StoreHeaderProps) => {
  const { add } = useNotifications();

  const handleUserGemsPress = () => {
    // TODO purchasing gems
    add({ type: 'info', body: 'In development...', time: 2500 });
    onRefresh();
  };

  return (
    <View style={styles.root}>
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
  );
};

const styles = StyleSheet.create({
  root: {
    maxHeight: 60,
    borderBottomColor: Colors.primary[500],
    borderBottomWidth: 2,
    zIndex: 9999,
    backgroundColor: Colors.gray[0],
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  storeLabel: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  gemsButtonContainer: {
    marginLeft: 'auto',
    marginRight: 10,
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
