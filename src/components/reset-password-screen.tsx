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

interface ResetPasswordScreenProps {
  onBack: () => void;
  onResetSuccess: () => void;
}

export function ResetPasswordScreen({
  onBack,
  onResetSuccess,
}: ResetPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleResetPassword = async () => {
    let hasError = false;

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
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully. Please sign in with your new password.',
        [{ text: 'OK', onPress: onResetSuccess }]
      );
    } catch (e) {
      Alert.alert('Reset Failed', 'Something went wrong. Please try again.');
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
            onPress={onBack}
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
            Reset Password
          </ThemedText>

          {/* Dummy view for layout centering */}
          <View style={tw`w-10`} />
        </View>

        {/* Content Section */}
        <View style={tw`flex-1 justify-center my-8`}>
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

          {/* Reset Password Button */}
          <Pressable
            onPress={handleResetPassword}
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
                Reset Password
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
