import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import React, { useState } from 'react';

import { SplashOnboarding } from '@/components/splash-onboarding';
import AppTabs from '@/components/app-tabs';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [showSplashOnboarding, setShowSplashOnboarding] = useState(true);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {showSplashOnboarding ? (
        <SplashOnboarding onFinish={() => setShowSplashOnboarding(false)} />
      ) : (
        <AppTabs />
      )}
    </ThemeProvider>
  );
}
