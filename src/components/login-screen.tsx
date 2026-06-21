import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';

import { ThemedText } from './themed-text';
import { storage } from '@/utils/storage';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword?: () => void;
}

export function LoginScreen({
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle Login
  const handleLogin = async () => {
    let hasError = false;
    
    // Simple Email validation
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);
    
    try {
      // Simulate API network call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Save mock token to persistent storage
      await storage.setItem('authToken', 'mock-user-auth-token-12345');
      
      // Call success callback
      onLoginSuccess();
    } catch (error) {
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-black`}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        contentContainerStyle={[
          tw`flex-grow justify-between px-6 pb-8`,
          { paddingTop: Math.max(insets.top, 24) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Section */}
        <View style={tw`items-center `}>
          <Image
            source={require('@/assets/logo.png')}
            style={tw`w-56 h-56`}
            resizeMode="contain"
          />
        </View>

        {/* Form Section */}
        <View style={tw`flex-1 justify-center`}>
          {/* Header */}
          <View style={tw`mb-6`}>
            <ThemedText style={tw`text-white font-extrabold text-2xl mb-1`}>
              Sign In
            </ThemedText>
            <ThemedText style={tw`text-neutral-550 text-sm font-medium`}>
              Welcome Back, You’ve been missed.
            </ThemedText>
          </View>

          {/* Email Input */}
          <View style={tw`mb-4`}>
            <ThemedText style={tw`text-white font-bold text-sm mb-2`}>
              Email
            </ThemedText>
            <View
              style={[
                tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center`,
                emailError ? tw`border-red-650` : tw`border-neutral-900`,
              ]}
            >
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#555555"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                style={[tw`flex-1 text-white text-sm p-0`, { outlineStyle: 'none' } as any]}
              />
            </View>
            {emailError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {emailError}
              </ThemedText>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={tw`mb-3`}>
            <ThemedText style={tw`text-white font-bold text-sm mb-2`}>
              Password
            </ThemedText>
            <View
              style={[
                tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center justify-between`,
                passwordError ? tw`border-red-650` : tw`border-neutral-900`,
              ]}
            >
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#555555"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                autoCapitalize="none"
                autoComplete="password"
                style={[tw`flex-grow text-white text-sm p-0 mr-2`, { outlineStyle: 'none' } as any]}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={tw`p-1`}
              >
                <SymbolView
                  name={
                    showPassword
                      ? { ios: 'eye.fill', android: 'visibility', web: 'visibility' }
                      : { ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' }
                  }
                  size={18}
                  tintColor="#6E7175"
                />
              </Pressable>
            </View>
            {passwordError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {passwordError}
              </ThemedText>
            ) : null}
          </View>

          {/* Forgot Password */}
          <Pressable
            onPress={onNavigateToForgotPassword}
            style={tw`align-self-end items-end mb-8`}
          >
            <ThemedText style={tw`text-neutral-500 text-xs font-semibold`}>
              Forgot password?
            </ThemedText>
          </Pressable>

          {/* Sign In Button */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={({ pressed }) => [
              tw`w-full bg-[#FF6C00] py-4 rounded-full items-center justify-center shadow-lg`,
              (pressed || isLoading) && tw`opacity-90 scale-[0.99]`,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <ThemedText style={tw`text-white font-bold text-base`}>
                Sign In
              </ThemedText>
            )}
          </Pressable>
        </View>

        {/* Footer Section */}
        <View style={tw` items-center`}>
          {/* Divider */}
          <View style={tw`flex-row items-center w-full mb-6`}>
            <View style={tw`flex-1 h-[1px] bg-neutral-900`} />
            <ThemedText style={tw`text-neutral-500 text-xs px-3 font-semibold`}>
              Sign In with
            </ThemedText>
            <View style={tw`flex-1 h-[1px] bg-neutral-900`} />
          </View>

          {/* Social Buttons */}
          <View style={tw`flex-row gap-4 mb-6`}>
            {/* Google */}
            <Pressable
              style={({ pressed }) => [
                tw`w-14 h-14 rounded-full   items-center justify-center shadow`,
                pressed && tw`opacity-80 scale-95`,
              ]}
            >
              <Image
                source={require('@/assets/google_logo.png')}
                style={tw`w-14 h-14 rounded-full `}
                resizeMode="contain"
              />
            </Pressable>

            {/* Facebook */}
            <Pressable
              style={({ pressed }) => [
                tw`w-14 h-14 rounded-full  items-center justify-center shadow`,
                pressed && tw`opacity-80 scale-95`,
              ]}
            >
              <Image
                source={require('@/assets/facebook_logo.png')}
                style={tw`w-14 h-14 rounded-full `}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Sign Up Link */}
          <View style={tw`flex-row items-center`}>
            <ThemedText style={tw`text-neutral-400 text-xs font-semibold`}>
              Don’t have an account?{' '}
            </ThemedText>
            <Pressable onPress={onNavigateToSignUp}>
              <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>
                Sign Up
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
