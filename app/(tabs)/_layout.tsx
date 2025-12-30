import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBarComponent: React.FC<CustomTabBarProps> = ({
  state,
  navigation,
}) => {
  const handleTabPress = (routeName: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find((r: any) => r.name === routeName)
        ?.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleFabPress = () => {
    navigation.navigate('modal');
  };

  const getIsFocused = (routeName: string) => {
    return (
      state.index ===
      state.routes.findIndex((r: any) => r.name === routeName)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.tabBarMain}>
          {/* Tab: Overview (index) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() =>
              handleTabPress('index', getIsFocused('index'))
            }
          >
            <MaterialCommunityIcons
              name="view-dashboard"
              size={24}
              color={
                getIsFocused('index') ? COLORS.primary : COLORS.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: getIsFocused('index')
                    ? COLORS.primary
                    : COLORS.slate,
                },
              ]}
            >
              Tổng quan
            </Text>
          </TouchableOpacity>

          {/* Tab: Map (ban-do) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() =>
              handleTabPress('ban-do', getIsFocused('ban-do'))
            }
          >
            <Ionicons
              name="map-outline"
              size={24}
              color={
                getIsFocused('ban-do') ? COLORS.primary : COLORS.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: getIsFocused('ban-do')
                    ? COLORS.primary
                    : COLORS.slate,
                },
              ]}
            >
              Bản đồ
            </Text>
          </TouchableOpacity>

          <View style={styles.placeholder} />

          {/* Tab: History (lich-su) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() =>
              handleTabPress('lich-su', getIsFocused('lich-su'))
            }
          >
            <Octicons
              name="history"
              size={24}
              color={
                getIsFocused('lich-su')
                  ? COLORS.primary
                  : COLORS.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: getIsFocused('lich-su')
                    ? COLORS.primary
                    : COLORS.slate,
                },
              ]}
            >
              Lịch sử
            </Text>
          </TouchableOpacity>

          {/* Tab: Profile - Hồ sơ */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() =>
              handleTabPress('ho-so', getIsFocused('ho-so'))
            }
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={
                getIsFocused('ho-so') ? COLORS.primary : COLORS.slate
              }
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: getIsFocused('ho-so')
                    ? COLORS.primary
                    : COLORS.slate,
                },
              ]}
            >
              Hồ sơ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Floating Center Button (+) */}
        <TouchableOpacity
          style={styles.fabButton}
          activeOpacity={0.8}
          onPress={handleFabPress}
        >
          <Ionicons name="add" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBarComponent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tổng quan' }} />
      <Tabs.Screen name="ban-do" options={{ title: 'Bản đồ' }} />
      <Tabs.Screen name="lich-su" options={{ title: 'Lịch sử' }} />
      <Tabs.Screen name="ho-so" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}

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
    backgroundColor: COLORS.white,
    width: '100%',
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.lg,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: SPACING.xs,
    color: COLORS.slate,
    fontWeight: '500',
  },
  placeholder: {
    width: 65,
  },
  fabButton: {
    position: 'absolute',
    top: -30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
