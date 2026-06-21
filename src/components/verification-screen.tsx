import React, { useState, useRef, useEffect } from 'react';
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

interface VerificationScreenProps {
  email?: string;
  onBack: () => void;
  onVerifySuccess: () => void;
}

export function VerificationScreen({
  email,
  onBack,
  onVerifySuccess,
}: VerificationScreenProps) {
  const insets = useSafeAreaInsets();
  
  // Initialize OTP with 2, 8, 4 as shown in screenshots
  const [code, setCode] = useState<string[]>(['2', '8', '4', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for OTP inputs
  const inputsRef = useRef<(TextInput | null)[]>([]);

  // Focus the first empty field on load (which is index 3 since 0,1,2 are prefilled)
  useEffect(() => {
    setTimeout(() => {
      inputsRef.current[3]?.focus();
    }, 100);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    // Only allow digits
    const cleanedText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = cleanedText.slice(-1); // Take the last entered character
    setCode(newCode);

    if (cleanedText && index < 5) {
      // Focus next input
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Clear previous input and focus it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      Alert.alert('Invalid Code', 'Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API verification call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      onVerifySuccess();
    } catch (error) {
      Alert.alert('Verification Failed', 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    Alert.alert('Code Resent', 'A new verification code has been sent to your email.');
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
            Verification
          </ThemedText>

          {/* Dummy view for layout centering */}
          <View style={tw`w-10`} />
        </View>

        {/* Content Section */}
        <View style={tw`flex-1 justify-center items-center my-4`}>
          {/* Title */}
          <ThemedText style={tw`text-white font-extrabold text-2xl text-center mb-3`}>
            Verify Your Account
          </ThemedText>

          {/* Description */}
          <ThemedText style={tw`text-neutral-500 text-sm font-medium text-center px-4 leading-5 mb-6`}>
            We've sent a verification code to your email/phone. Please check and enter it below.
          </ThemedText>

          {/* Illustration */}
          <View style={tw`w-full items-center justify-center mb-8`}>
            <Image
              source={require('@/assets/Group 14928.png')}
              style={tw`w-52 h-44`}
              resizeMode="contain"
            />
          </View>

          {/* OTP Code Input Boxes */}
          <View style={tw`flex-row justify-between w-full max-w-[340px] mb-6`}>
            {code.map((digit, idx) => (
              <View
                key={idx}
                style={tw`w-12 h-14 bg-[#0A0A0A] border border-neutral-900 rounded-xl justify-center items-center`}
              >
                <TextInput
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  keyboardType="number-pad"
                  maxLength={2} // allow 2 to capture fast typing, handle slice
                  selectTextOnFocus
                  style={[
                    tw`text-white text-xl font-bold text-center w-full h-full`,
                    { outlineStyle: 'none' } as any,
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Resend Code Link */}
          <View style={tw`flex-row items-center mb-8`}>
            <ThemedText style={tw`text-neutral-400 text-sm font-semibold`}>
              Didn't get a code?{' '}
            </ThemedText>
            <Pressable onPress={handleResendCode}>
              <ThemedText style={tw`text-[#FF6C00] text-sm font-bold`}>
                Resend Code
              </ThemedText>
            </Pressable>
          </View>

          {/* Verify Code Button */}
          <Pressable
            onPress={handleVerify}
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
                Verify Code
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
