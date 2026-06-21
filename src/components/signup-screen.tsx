import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

export function SignUpScreen({ onSignUpSuccess, onNavigateToLogin }: SignUpScreenProps) {
  const insets = useSafeAreaInsets();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Form Submission
  const handleSignUp = async () => {
    let hasError = false;

    // Name Validation
    if (!fullName.trim()) {
      setNameError('Full Name is required');
      hasError = true;
    } else {
      setNameError('');
    }

    // Email Validation
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Phone Validation
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      hasError = true;
    } else {
      setPhoneError('');
    }

    // Password Validation
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Save token to persist authentication
      await storage.setItem('authToken', 'mock-user-auth-token-12345');

      onSignUpSuccess();
    } catch (e) {
      Alert.alert('Sign Up Failed', 'Something went wrong. Please try again.');
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
        {/* Main Content */}
        <View style={tw`flex-1 justify-center mt-4`}>
          {/* Header */}
          <View style={tw`mb-6`}>
            <ThemedText style={tw`text-white font-extrabold text-2xl mb-1`}>
              Sign Up
            </ThemedText>
            <ThemedText style={tw`text-neutral-500 text-sm font-medium`}>
              Let's get you set up and ready to go.
            </ThemedText>
          </View>

          {/* Full Name Input */}
          <View style={tw`mb-4`}>
            <ThemedText style={tw`text-white font-bold text-sm mb-2`}>
              Full Name
            </ThemedText>
            <View
              style={[
                tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center`,
                nameError ? tw`border-red-650` : tw`border-neutral-900`,
              ]}
            >
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#555555"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (nameError) setNameError('');
                }}
                autoCapitalize="words"
                style={[tw`flex-grow text-white text-sm p-0`, { outlineStyle: 'none' } as any]}
              />
            </View>
            {nameError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {nameError}
              </ThemedText>
            ) : null}
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
                style={[tw`flex-grow text-white text-sm p-0`, { outlineStyle: 'none' } as any]}
              />
            </View>
            {emailError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {emailError}
              </ThemedText>
            ) : null}
          </View>

          {/* Phone Number Input */}
          <View style={tw`mb-4`}>
            <ThemedText style={tw`text-white font-bold text-sm mb-2`}>
              Phone number
            </ThemedText>
            <View
              style={[
                tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center`,
                phoneError ? tw`border-red-650` : tw`border-neutral-900`,
              ]}
            >
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor="#555555"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) setPhoneError('');
                }}
                keyboardType="phone-pad"
                style={[tw`flex-grow text-white text-sm p-0`, { outlineStyle: 'none' } as any]}
              />
            </View>
            {phoneError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {phoneError}
              </ThemedText>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={tw`mb-4`}>
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

          {/* Confirm Password Input */}
          <View style={tw`mb-8`}>
            <ThemedText style={tw`text-white font-bold text-sm mb-2`}>
              Confirm Password
            </ThemedText>
            <View
              style={[
                tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center justify-between`,
                confirmPasswordError ? tw`border-red-650` : tw`border-neutral-900`,
              ]}
            >
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#555555"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
                autoCapitalize="none"
                style={[tw`flex-grow text-white text-sm p-0 mr-2`, { outlineStyle: 'none' } as any]}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={tw`p-1`}
              >
                <SymbolView
                  name={
                    showConfirmPassword
                      ? { ios: 'eye.fill', android: 'visibility', web: 'visibility' }
                      : { ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' }
                  }
                  size={18}
                  tintColor="#6E7175"
                />
              </Pressable>
            </View>
            {confirmPasswordError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {confirmPasswordError}
              </ThemedText>
            ) : null}
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={isLoading}
            style={({ pressed }) => [
              tw`w-full bg-[#FF6C00] py-4 rounded-full items-center justify-center shadow-lg mb-6`,
              (pressed || isLoading) && tw`opacity-90 scale-[0.99]`,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <ThemedText style={tw`text-white font-bold text-base`}>
                Sign Up
              </ThemedText>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={tw`items-center`}>
          <View style={tw`flex-row items-center`}>
            <ThemedText style={tw`text-neutral-400 text-xs font-semibold`}>
              Already have an account?{' '}
            </ThemedText>
            <Pressable onPress={onNavigateToLogin}>
              <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>
                Sign In
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
