import IncidentMap from '@/components/core/IncidentMap';
import NewsSlider from '@/components/core/NewsSlider';
import StatCard from '@/components/core/StatCard';
import TopHeader from '@/components/core/TopHeader';
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
        <View style={{ height: 240 }} />
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
