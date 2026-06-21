import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { View, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';

import { SplashOnboarding } from '@/components/splash-onboarding';
import { LoginScreen } from '@/components/login-screen';
import { SignUpScreen } from '@/components/signup-screen';
import AppTabs from '@/components/app-tabs';
import { storage } from '@/utils/storage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [authState, setAuthState] = useState<'splash' | 'login' | 'signup' | 'authenticated'>('splash');
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await storage.getItem('authToken');
        setHasToken(!!token);
      } catch (e) {
        setHasToken(false);
      }
    }
    checkAuth();
  }, []);

  if (hasToken === null) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {authState === 'splash' ? (
        <SplashOnboarding
          skipOnboarding={hasToken}
          onFinish={() => setAuthState(hasToken ? 'authenticated' : 'login')}
        />
      ) : authState === 'login' ? (
        <LoginScreen
          onLoginSuccess={() => setAuthState('authenticated')}
          onNavigateToSignUp={() => setAuthState('signup')}
        />
      ) : authState === 'signup' ? (
        <SignUpScreen
          onSignUpSuccess={() => setAuthState('authenticated')}
          onNavigateToLogin={() => setAuthState('login')}
        />
      ) : (
        <AppTabs />
      )}
    </ThemeProvider>
  );
}

