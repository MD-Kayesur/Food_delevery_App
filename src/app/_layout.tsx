import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { View, useColorScheme, DeviceEventEmitter } from 'react-native';
import React, { useState, useEffect } from 'react';

import { SplashOnboarding } from '@/components/splash-onboarding';
import { LoginScreen } from '@/components/login-screen';
import { SignUpScreen } from '@/components/signup-screen';
import { ForgotPasswordScreen } from '@/components/forgot-password-screen';
import { VerificationScreen } from '@/components/verification-screen';
import { ResetPasswordScreen } from '@/components/reset-password-screen';
import AppTabs from '@/components/app-tabs';
import { storage } from '@/utils/storage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [authState, setAuthState] = useState<
    'splash' | 'login' | 'signup' | 'forgot_password' | 'verification' | 'reset_password' | 'authenticated'
  >('splash');
  const [resetEmail, setResetEmail] = useState('');
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

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('logout', async () => {
      try {
        await storage.deleteItem('authToken');
      } catch (e) {
        console.warn('Failed to delete auth token:', e);
      }
      setAuthState('login');
    });
    return () => {
      subscription.remove();
    };
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
          onNavigateToForgotPassword={() => setAuthState('forgot_password')}
        />
      ) : authState === 'signup' ? (
        <SignUpScreen
          onSignUpSuccess={() => setAuthState('authenticated')}
          onNavigateToLogin={() => setAuthState('login')}
        />
      ) : authState === 'forgot_password' ? (
        <ForgotPasswordScreen
          onBackToLogin={() => setAuthState('login')}
          onSendCodeSuccess={(email) => {
            setResetEmail(email);
            setAuthState('verification');
          }}
        />
      ) : authState === 'verification' ? (
        <VerificationScreen
          email={resetEmail}
          onBack={() => setAuthState('forgot_password')}
          onVerifySuccess={() => setAuthState('reset_password')}
        />
      ) : authState === 'reset_password' ? (
        <ResetPasswordScreen
          onBack={() => setAuthState('verification')}
          onResetSuccess={() => setAuthState('login')}
        />
      ) : (
        <AppTabs />
      )}
    </ThemeProvider>
  );
}

