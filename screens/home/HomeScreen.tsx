import { SafeAreaView, ScrollView, LogBox, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ActionIcon from '../../components/common/ActionIcon';
import Title from '../../components/common/Title';
import BotCarousel from '../../components/chat/bots/BotCarousel';
import UserLoggedDatesCalendar from '../../components/stats/UserLoggedDatesCalendar';
import WordLearningStatusBarChart from '../../components/stats/WordLearningStatusBarChart';
import UserExperienceBar from '../../components/gamification/experience/UserExperienceBar';
import QuestsList from '../../components/quest/QuestsList';
import React, { useEffect } from 'react';

const HomeScreen = () => {
  const navigator = useNavigation();

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.xprow}>
              <UserExperienceBar />
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
          <View style={styles.questsSection}>
            <QuestsList />
          </View>
          <View style={styles.statSection}>
            <WordLearningStatusBarChart />
          </View>
          <View style={styles.statSection}>
            <UserLoggedDatesCalendar />
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
  questsSection: {
    marginVertical: 8,
  },
});
