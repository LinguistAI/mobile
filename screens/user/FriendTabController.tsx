import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import FriendsScreen from './FriendsScreen';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import FriendRequestsScreen from './FriendRequestsScreen';
import Colors from '../../theme/colors';

const renderScene = SceneMap({
  first: FriendsScreen,
  second: FriendRequestsScreen,
});

const FriendTabController = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Friends' },
    { key: 'second', title: 'Requests' },
  ]);
  const layout = useWindowDimensions();

  return (
    <SafeAreaView style={styles.root}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: Colors.primary[500] }}
            indicatorStyle={{ backgroundColor: Colors.grape[600] }}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default FriendTabController;
