import IncidentMap from '@/components/dashboard/IncidentMap';
import NewsSlider from '@/components/dashboard/NewsSlider';
import RecentActivity from '@/components/dashboard/RecentActivity';
import StatCard from '@/components/dashboard/StatCard';
import TopHeader from '@/components/dashboard/TopHeader';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TopHeader />
        <StatCard />
        <IncidentMap />
        <NewsSlider />
        <RecentActivity />
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
