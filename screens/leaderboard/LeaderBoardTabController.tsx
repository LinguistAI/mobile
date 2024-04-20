import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import Colors from '../../theme/colors';
import FriendsLeaderboardScreen from './FriendsLeaderboardScreen';
import GlobalLeaderboardScreen from './GlobalLeaderboardScreen';

const renderScene = SceneMap({
  first: GlobalLeaderboardScreen,
  second: FriendsLeaderboardScreen,
});

const LeaderboardTabController = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Global' },
    { key: 'second', title: 'Friends' },
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
    marginTop: 20,
  },
});

export default LeaderboardTabController;
