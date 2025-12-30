import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'landing-page',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === '' ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen
          name="landing-page"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            title: 'Dashboard',
            headerRight: () => (
              <Button
                onPress={() => router.push('/landing-page')}
                title="Sign In"
              />
            ),
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
