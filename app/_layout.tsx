import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const router = useRouter();
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerTitle: 'Gửi phản ánh mới',
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 5 }}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={COLORS.gray900}
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
