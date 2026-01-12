import { COLORS } from '@/constants/colors';
import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutStyles } from '@/components/styles';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBarComponent: React.FC<CustomTabBarProps> = ({
  state,
  navigation,
}) => {
  const router = useRouter();

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
    // Open report form modal screen
    router.push('/modal');
  };

  const getIsFocused = (routeName: string) => {
    return (
      state.index ===
      state.routes.findIndex((r: any) => r.name === routeName)
    );
  };

  return (
    <SafeAreaView style={LayoutStyles.container}>
      <View style={LayoutStyles.container}>
        <View style={LayoutStyles.tabBarMain}>
          {/* Tab: Overview (index) */}
          <TouchableOpacity
            style={LayoutStyles.tabItem}
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
                LayoutStyles.tabLabel,
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
            style={LayoutStyles.tabItem}
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
                LayoutStyles.tabLabel,
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

          <View style={LayoutStyles.placeholder} />

          {/* Tab: History (lich-su) */}
          <TouchableOpacity
            style={LayoutStyles.tabItem}
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
                LayoutStyles.tabLabel,
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
            style={LayoutStyles.tabItem}
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
                LayoutStyles.tabLabel,
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
          style={LayoutStyles.fabButton}
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
      <Tabs.Screen
        name="notifications"
        options={{ title: 'Thông báo' }}
      />
      <Tabs.Screen name="ho-so" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}
