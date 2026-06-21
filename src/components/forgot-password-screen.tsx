import React, { useState } from 'react';
import {
  ActivityIndicator,
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

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  onSendCodeSuccess: (email: string) => void;
}

export function ForgotPasswordScreen({
  onBackToLogin,
  onSendCodeSuccess,
}: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    // Simple Email validation
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    setIsLoading(true);

    try {
      // Simulate API network call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      onSendCodeSuccess(email);
    } catch (error) {
      // Handle error
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
          { paddingTop: Math.max(insets.top, 16) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header */}
        <View style={tw`flex-row items-center justify-between py-4`}>
          <Pressable
            onPress={onBackToLogin}
            style={({ pressed }) => [
              tw`p-2 -ml-2 rounded-full`,
              pressed && tw`bg-neutral-900`,
            ]}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={24}
              tintColor="#FFFFFF"
            />
          </Pressable>
          
          <ThemedText style={tw`text-white font-bold text-lg`}>
            Forgot Password
          </ThemedText>

          {/* Dummy view for layout centering */}
          <View style={tw`w-10`} />
        </View>

        {/* Content Section */}
        <View style={tw`flex-1 justify-center my-8`}>
          {/* Titles */}
          <View style={tw`items-center mb-8`}>
            <ThemedText style={tw`text-white font-extrabold text-2xl text-center mb-3`}>
              Forgot Password?
            </ThemedText>
            <ThemedText style={tw`text-neutral-500 text-sm font-medium text-center px-4 leading-5`}>
              Enter your email and we will send you a verification code
            </ThemedText>
          </View>

          {/* Email Input */}
          <View style={tw`mb-8`}>
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
                style={[tw`flex-grow text-white text-sm p-0`, { outlineStyle: 'none' } as any]}
              />
            </View>
            {emailError ? (
              <ThemedText style={tw`text-red-500 text-xs mt-1.5 ml-1`}>
                {emailError}
              </ThemedText>
            ) : null}
          </View>

          {/* Send Code Button */}
          <Pressable
            onPress={handleSendCode}
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
                Send Code
              </ThemedText>
            )}
          </Pressable>
        </View>

        {/* Empty Footer for centering */}
        <View style={tw`h-8`} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
