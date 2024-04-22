import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ActionIcon from '../../components/common/ActionIcon';
import Title from '../../components/common/Title';
import BotCarousel from '../../components/chat/bots/BotCarousel';
import ExperienceBar from '../../components/gamification/experience/ExperienceBar';
import LoggedDatesCalendar from '../../components/stats/LoggedDatesCalendar';
import WordLearningStatusBarChart from '../../components/stats/WordLearningStatusBarChart';

const HomeScreen = () => {
  const navigator = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.xprow}>
              <ExperienceBar />
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
          <View style={styles.botCarousel}>
            <Title size="h4">Start a conversation!</Title>
            <BotCarousel />
          </View>
          <View style={styles.statSection}>
            <WordLearningStatusBarChart />
          </View>
          <View style={styles.statSection}>
            <LoggedDatesCalendar />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileIcon: {
    maxWidth: 50,
    alignSelf: 'flex-end',
  },
  xprow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  botCarousel: {
    marginTop: 15,
  },
  statSection: {
    marginVertical: 8,
  },
});
