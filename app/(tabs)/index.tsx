import IncidentMap from '@/components/core/IncidentMap';
import StatCard from '@/components/core/StatCard';
import TopHeader from '@/components/core/TopHeader';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView>
        <TopHeader />
        <StatCard />
        <IncidentMap />
      </SafeAreaView>
    </>
  );
}
