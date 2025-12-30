import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CustomTabBar = () => {
  return (
    <View style={styles.container}>
      {/* Background Tab Bar */}
      <View style={styles.tabBarMain}>
        {/* Tab: Overview */}
        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons
            name="view-dashboard"
            size={24}
            color="#3B82F6"
          />
          <Text style={[styles.tabLabel, { color: '#3B82F6' }]}>
            Tổng quan
          </Text>
        </TouchableOpacity>

        {/* Tab: Map */}
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="map-outline" size={24} color="#94A3B8" />
          <Text style={styles.tabLabel}>Bản đồ</Text>
        </TouchableOpacity>

        {/* Placeholder for the Center Button */}
        <View style={styles.placeholder} />

        {/* Tab: History */}
        <TouchableOpacity style={styles.tabItem}>
          <Octicons name="history" size={24} color="#94A3B8" />
          <Text style={styles.tabLabel}>Lịch sử</Text>
        </TouchableOpacity>

        {/* Tab: Profile */}
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={24} color="#94A3B8" />
          <Text style={styles.tabLabel}>Hồ sơ</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Center Button (+) */}
      <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
        <View style={styles.fabGradient}>
          <Ionicons name="add" size={35} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabBarMain: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0, // Extra space for iOS bottom bar
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    // Shadow
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#94A3B8',
    fontWeight: '500',
  },
  placeholder: {
    width: 60, // Space for the floating button
  },
  fabButton: {
    position: 'absolute',
    top: -30, // Moves the button half-way out of the bar
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for FAB
    elevation: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomTabBar;
