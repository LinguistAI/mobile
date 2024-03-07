import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ActionIcon from '../../components/common/ActionIcon';
import ChatStreakContainer from '../../components/gamification/ChatStreakContainer';

const HomeScreen = () => {
  const [streakModalVisible, setModalVisible] = useState(false);
  const navigator = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.root}>
        <View style={styles.topContainer}>
          <View style={styles.chatStreakContainer}>
            <ChatStreakContainer />
          </View>
          <View style={styles.profileIcon}>
            <ActionIcon
              icon={<Ionicons name="person-circle-outline" size={36} color="black" />}
              onPress={() => {
                navigator.navigate('Profile');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the background color
    maxHeight: 350,
    marginVertical: 50,
    margin: 10,
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    paddingVertical: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  chatStreakContainer: {
    maxWidth: 150,
    marginLeft: 20,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 20,
    maxWidth: 50,
  },
});
